require('dotenv').config();
const express = require('express');
/* const request = require('request'); */
/* const _ = require('lodash'); */
/* const pool = require('./pool'); */
const path = require('path');
const PORT = process.env.PORT || 5000;
/* const pool = require('./routes/pool.js'); */
const bodyParser = require('body-parser');
/* const config = require('./config'); */
const adminRoutes = require('./routes/admin.js');
const testRoutes = require('./routes/test.js');
const tagsRoutes = require('./routes/tags.js');
let app = express();

/* // vk app id
const vkappid = config.vk.appid;
// secret key for vk app
const secretkey = process.env.VK_API_KEY;*/
// connection to postgreg

app
    .use(express.static(path.join(__dirname, 'public/')))
    .use(bodyParser.json())
    .use('/', adminRoutes)
    .use('/test', testRoutes)
    .use('/tags', tagsRoutes)
    .set('views', './public')
    .set('view engine', 'pug')
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));

module.exports = app; // для тестирования
