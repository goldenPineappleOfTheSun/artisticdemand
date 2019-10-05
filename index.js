const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const $ = require('jquery');
var app = express();


app.use(express.static(path.join(__dirname, 'dist')))
  .get('/renderapitoken', (req, res) => {
    res.send(req.query.code);
  })
  .get('*', (req, res) => {
  	console.log('=)');
  	res.render('index');
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))