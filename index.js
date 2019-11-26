const express = require('express');
const request = require('request');
const path = require('path');
const PORT = process.env.PORT || 5000;
var app = express();
const { Pool } = require('pg');;
const bodyParser = require('body-parser')
const config = require('./config');

app
    .use(express.static(path.join(__dirname, 'public/')))
    .use(bodyParser.json())
    .set('views', './public')
    .set('view engine', 'pug')
    .get('*', (req, res) => {
        res.send('hello!');
    })
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))