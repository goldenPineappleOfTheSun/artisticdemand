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
    let host = `https://${req.headers.host}`;
    res.redirect(
      `https://oauth.vk.com/authorize?client_id=${vkappid}&redirect_uri=${host}/maintenance&scope=4&response_type=code`);
  })  
  .get('/vkapi', (req, res) => {
     })
  .get('/maintenance', (req, res) => {

    let token = null;

    let host = `https://${req.headers.host}`;

    Promise.resolve().then(
      () => {
        return new Promise((resolve, reject) => {
          request.get(
            `https://oauth.vk.com/access_token?client_id=${vkappid}&client_secret=${secretkey}&redirect_uri=${host}/maintenance&code=${req.query.code}`,
            {json: true},
            (error, response, body) => {
              token = body;
              resolve(token);
            });
        });
      })
    .then(
      (token) => {
        return new Promise((resolve, reject) => {
          request.get(
            `https://api.vk.com/method/photos.getAll?owner_id=${333009378}&count=${200}&access_token=${token.access_token}&v=5.102`,
            {json: true},
            (error, response, body) => {
              res.end(JSON.stringify(body));
            });
      })
    })
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