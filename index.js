const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const $ = require('jquery');
var app = express();
var cors = require('cors');

app.use(cors());

app.use(express.static(path.join(__dirname, 'dist')))
  .get('/vkapitoken', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ 
      code: req.query.code 
    }));
  })
  .get('/vkapiauth', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(
      { 
        access_token: req.query.access_token, 
        expires_in: req.query.expires_in, 
        user_id: req.query.user_id
      }));
  })
  .get('*', (req, res) => {
  	console.log('=)');
  	res.render('index');
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))