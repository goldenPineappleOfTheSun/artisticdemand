require('dotenv').config();
const express = require('express');
const request = require('request');
const path = require('path');
const PORT = process.env.PORT || 5000;
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const config = require('./config');
let app = express();

// vk app id
const vkappid = config.vk.appid;
// secret key for vk app
const secretkey = process.env.VK_API_KEY;
// connection to postgreg
const pool = new Pool({
    connectionString: config.pg.connectionString,
    ssl: true
});

app
    .use(express.static(path.join(__dirname, 'public/')))
    .use(bodyParser.json())
    .set('views', './public')
    .set('view engine', 'pug')
    .get('/ping', async (req, res) => {
        try {
            const client = await pool.connect();
            const result = await client.query(`select * from ping`);    
            res.send(`"${result.rows[0].ping}"`);
        } catch (err) {
            console.error(err);
            res.send("Error " + err);
        }   
    })
    .get('*', (req, res) => {
        res.send('hello!');
    })
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))