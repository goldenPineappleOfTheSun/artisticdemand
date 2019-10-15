const express = require('express');
const request = require('request');
const path = require('path');
const PORT = process.env.PORT || 5000;
var app = express();
var cors = require('cors');

const vkappid = '7157642';
const secretkey = '7TKqaYoXtV3wmVOO91Be';

app.use(cors());

app.use(express.static(path.join(__dirname, 'dist')))
  .get('/admin', (req, res) => {
    let host = `${req.protocol}://${req.headers.host}`;
    res.redirect(
      `https://oauth.vk.com/authorize?client_id=${vkappid}&redirect_uri=${host}/vkapi&scope=4&response_type=code`);
  })  
  .get('/vkapi', (req, res) => {
    let host = `${req.protocol}://${req.headers.host}`;
     res.redirect(
      `https://oauth.vk.com/access_token?client_id=${vkappid}&client_secret=${secretkey}&redirect_uri=${host}/photos&code=${req.query.code}`);
  })
  .get('/photos', (req, res) => {
    request.get(      
      `https://api.vk.com/method/photos.getAll?owner_id=${333009378}&count=${200}&access_token=${req.query.access_token}&v=5.102`,
      {json: true},
      (err, res, body) => {
        if (!err && res.statusCode === 200) {
          console.log(body);
        }
        else {
          console.log(body);
        }
      })
    /*$.ajax({
      method: 'get',
      url: `https://api.vk.com/method/photos.getAll?owner_id=${333009378}&count=${200}&access_token=7409c8a4e851665749&v=5.102`
    })*/
  })
  .get('*', (req, res) => {
    console.log(req.headers.host);
  })
  /*.get('/vkapitoken', (req, res) => {
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
  })*/
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))