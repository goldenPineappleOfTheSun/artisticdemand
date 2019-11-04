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
                    console.log('!');
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
                //let status = x.status == 'good' ? 'g' : x.status == 'new' ? 'n' : x.status == 'deleted' ? 'd' : 'x';
                query.push([`(${x.id}, ${x.album_id}, ${x.date}, ${x.owner_id}, '${x.text}', 'n')`])
            });

            let picResult = await client.query(queryStart + query.join(',') + ';');

            /* picture size */

            queryStart = 'insert into picture_size (src, type, width, height, picture_id) values '
            query = [];
            req.body.forEach((x) => {
                x.sizes.forEach((o) => {
                    query.push([`('${o.src}', '${o.type}', ${o.width}, ${o.height}, '${x.id}')`])
                })
            });

            let sizeResult = await client.query(queryStart + query.join(',') + ';');


            client.end();
            res.send('ok');

            //res.send(JSON.stringify(req.body));

           // console.log('----------');  
            /*let x = req.body.inserts[0];      
            let status = x.status == 'good' ? 'g' : x.status == 'new' ? 'n' : x.status == 'deleted' ? 'd' : 'x';     
            //console.log(`insert into picture (id, album_id, date, owner_id, text, status) values (${x.id}, ${x.album_id}, ${x.date}, ${x.owner_id}, ${x.text}, ${x.status})`);

            let result = await client.query('insert into picture (id, album_id, date, owner_id, text, status) values ($1, $2, $3, $4, $5, $6)', 
                    [x.id, x.album_id, x.date, x.owner_id, x.text, status]);
           */
           /*for (var i=0; i<req.body.inserts.length; i++) {
                //console.log("------------");
                //console.log(JSON.stringify(req.body.inserts[i]));
                let x = req.body.inserts[i];    
                let status = x.status == 'good' ? 'g' : x.status == 'new' ? 'n' : x.status == 'deleted' ? 'd' : 'x';     

                let result = await client.query('insert into picture (id, album_id, date, owner_id, text, status) values ($1, $2, $3, $4, $5, $6)', 
                    [x.id, x.album_id, x.date, x.owner_id, x.text, status]);
                //console.log(JSON.stringify(req.body.inserts[i]));
           }*/

            //console.log(result);
           // console.log('----------');

            /*req.body.inserts.forEach(async (x) => {
                client.query('insert into pictures values ($1, $2, $3, $4, $5, $6)', 
                    [x.id, x.album_id, x.date, x.owner_id, x.text, x.status]);
            });*/

            /*pool.connect(function(err, client, done) {
              var stream = client.query(copyFrom('COPY my_table FROM STDIN'));
              var fileStream = fs.createReadStream('some_file.tsv')
              fileStream.on('error', done);
              stream.on('error', done);
              stream.on('end', done);
              fileStream.pipe(stream);
            });*/

           // client.end();
           // res.send('ok');
        } catch (err) {
        }   
    })
    .get('*', (req, res) => {
        console.log("404");
    })
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))