const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const $ = require('jquery');
var app = express();


app.use(express.static(path.join(__dirname, 'dist')))
  .get('/testapi', (req, res) => {
  	$.ajax({
  		url: 'https://oauth.vk.com/authorize?client_id=7157642&display=page&redirect_uri=https://oauth.vk.com/blank.html&scope=friends&response_type=token&v=5.52',
  		method: 'get',
  		success: function(data) {
  			console.log(data);
  		}
  	})
  	res.render('index');
  })
  .get('*', (req, res) => {
  	console.log('=)');
  	res.render('index');
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))