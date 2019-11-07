const express = require('express');
const request = require('request');
const path = require('path');
const PORT = process.env.PORT || 5000;
var app = express();
const { Pool } = require('pg');;
const bodyParser = require('body-parser')

// vk app id
const vkappid = '7157642';
// secret key for vk app
const secretkey = '7TKqaYoXtV3wmVOO91Be';
// connection to postgreg
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});

app
    .use(express.static(path.join(__dirname, 'public/')))
    .use(bodyParser.json())
    .set('views', './public')
    .set('view engine', 'pug')
    .get('/admin', (req, res) => {
        if (!req.query.loaded)
        {
            let host = `https://${req.headers.host}`;
            res.redirect(
                `https://oauth.vk.com/authorize?client_id=${vkappid}&redirect_uri=${host}/maintenance&scope=4&response_type=code`);        
        }
        else
        {
            res.sendFile(path.join(__dirname, 'public/admin.html'));           
        }
    })  
    .get('/maintenance', (req, res) => {

        let token = null;

        let host = `https://${req.headers.host}`;

        request.get(
            `https://oauth.vk.com/access_token?client_id=${vkappid}&client_secret=${secretkey}&redirect_uri=${host}/maintenance&code=${req.query.code}`,
            {json: true},
            async (error, response, body) => {
                try {
                    const client = await pool.connect()
                    const result = await client.query(`update vk_access_token set token = $1`, [body.access_token]);
                    res.redirect(`https://${req.headers.host}/admin?loaded=true`);
                    client.release();        
                } catch (err) {
                    console.error(err);
                    res.send("Error " + err);
                }                    
            });
    })
    .get('/loadvkphotos', async (req, res) => {
        try {
            const client = await pool.connect()
            const result = await client.query(`select token from vk_access_token`);      
            request.get(
                `https://api.vk.com/method/photos.getAll?owner_id=${333009378}&count=${req.query.count}&offset=${req.query.offset}&access_token=${result.rows[0].token}&v=5.102`,
                {json: true},
                (error, response, body) => {
                    res.send(body.response);
                });
            client.end();
        } catch (err) {
            console.error(err);
            res.send("Error " + err);
        }   
    })
    .get('/loadpictures', async (req, res) => {
        try {
            const client = await pool.connect();
            const count = await client.query(`select count(id) as c from picture`);   
            const result = await client.query(`select * from picture limit ${req.query.count} offset ${req.query.offset}`);      
            res.send({items: result.rows, count: count.rows[0]['c']});
            client.end();
        } catch (err) {
            console.error(err);
            res.send("Error " + err);
        }   
    })
    .post('/uploadpictures', async (req, res) => {       
        try {            
            const client = await pool.connect();

            /* picture */

            let queryStart = 'insert into picture (id, album_id, date, owner_id, text, status) values '
            let query = [];
            req.body.forEach((x) => {
                query.push([`(${x.id}, ${x.album_id}, ${x.date}, ${x.owner_id}, '${x.text}', 'n')`])
            });

            let picResult = await client.query(queryStart + query.join(',') + ';');

            /* picture size */

            queryStart = 'insert into picture_size (src, type, width, height, picture_id) values '
            query = [];
            req.body.forEach((x) => {
                x.sizes.forEach((o) => {
                    query.push([`('${o.url}', '${o.type}', ${o.width}, ${o.height}, '${x.id}')`])
                })
            });

            let sizeResult = await client.query(queryStart + query.join(',') + ';');

            client.end();
            res.send('ok');
        } 
        catch (err) {
            res.send('nope');
        }   
    })
    .post('/updatepictures', async (req, res) => {       
        try {            
            const client = await pool.connect();

            /* picture */

            let queryStart = 'update picture as p set status = c.status from (values ';
            let queryEnd = ') as c(id, status) where p.id = c.id;';
            let query = [];
            req.body.forEach((x) => {
                query.push(`(${x.id}, '${x.status}')`);
            });

            let picResult = await client.query(queryStart + query.join(',') + queryEnd);

            client.end();
            res.send('ok');
        } 
        catch (err) {
            res.send('nope');
        }   
    })
    .get('*', (req, res) => {
        console.log("404");
    })
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))