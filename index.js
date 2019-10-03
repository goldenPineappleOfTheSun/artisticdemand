const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
var app = express();

app.use(express.static(path.join(__dirname, 'dist')))
  .get('*', (req, res) => {
  	console.log('=)');
  	res.render('index');
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))