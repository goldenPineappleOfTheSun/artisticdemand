require('dotenv').config();
const express = require('express');
const request = require('request');
const _ = require('lodash');
const path = require('path');
const PORT = process.env.PORT || 5000;
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const config = require('./config');
let app = express();

// vk app id
const vkappid = config.vk.appid;
// secret key for vk app
const secretkey = process.env.VK_API_KEY;
// connection to postgreg
const pool = new Pool({
    connectionString: config.pg.connectionString,
    ssl: true
});

app
    .use(express.static(path.join(__dirname, 'public/')))
    .use(bodyParser.json())
    .set('views', './public')
    .set('view engine', 'pug')
    .get('/admindatabasetables', async (req, res) => {

        if (exitIfNotAdmin(req, res) === false){
            return;
        };

        try {
            const client = await pool.connect();
            const result = await client.query(`SELECT * FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema';`);    
            return res.send(JSON.stringify(result));
        } catch (err) {
            console.error(err);
            return res.send("Error " + err);
        }          
    })
    .get('/admindescribetable', async (req, res) => { 

        if (exitIfNotAdmin(req, res) === false){
            return;
        };

        try {
            const client = await pool.connect();
            const result = await client.query(`SELECT * FROM information_schema.COLUMNS WHERE TABLE_NAME = '${req.query.table}';`);    
            return res.send(JSON.stringify(result));
        } catch (err) {
            console.error(err);
            return res.send("Error " + err);
        }  
    })
    .get('/adminindexes', async (req, res) => { 

        if (exitIfNotAdmin(req, res) === false){
            return;
        };

        try {
            const client = await pool.connect();
            const result = await client.query(`SELECT indexname, indexdef FROM pg_indexes WHERE tablename = '${req.query.table}';`);    
            return res.send(JSON.stringify(result));
        } catch (err) {
            console.error(err);
            return res.send("Error " + err);
        }  
    })
    .get('/adminforeignkeys', async (req, res) => { 

        if (exitIfNotAdmin(req, res) === false){
            return;
        };

        return res.send(JSON.stringify(result));
        try {
            const client = await pool.connect();
            const result = await client.query(`SELECT
                tc.constraint_name, tc.table_name, kcu.column_name,
                rk.update_rule,
                rk.delete_rule,
                ccu.table_name AS foreign_table_name,
                ccu.column_name AS foreign_column_name 
            FROM 
                information_schema.table_constraints AS tc 
                JOIN information_schema.key_column_usage AS kcu
                  ON tc.constraint_name = kcu.constraint_name
                JOIN information_schema.constraint_column_usage AS ccu
                  ON ccu.constraint_name = tc.constraint_name
                JOIN information_schema.referential_constraints AS rk
                  ON tc.constraint_name = rk.constraint_name
            WHERE constraint_type = 'FOREIGN KEY'`);    
            return res.send(JSON.stringify(result));
        } catch (err) {
            console.error(err);
            return res.send("Error " + err);
        }
    })
    .get('/comparedatabases', async (req, res) => {
        // contract
        if (process.env.NODE_ENV !== 'test') {
            return res.send("Для этого надо запускать тестовую конфигурацию");
        }

        if (exitIfNotAdmin(req, res) === false){
            return;
        };

        try {
            // connect
            let comparePool = new Pool({
                connectionString: config.pg.compareConnectionString,
                ssl: true
            })

            // get tables
            const originClient = await comparePool.connect();
            let originResult = await originClient.query(`SELECT * FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema';`)
                
            originResult = originResult.rows
                .reduce((acc, cur) => { acc[cur.tablename] = cur.tablename; return acc}, {});    

            const testClient = await pool.connect();
            let testResult = await testClient.query(`SELECT * FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema';`)
            
            testResult = testResult.rows
                .reduce((acc, cur) => { acc[cur.tablename] = cur.tablename; return acc}, {}); 

            // check tables
            for (var x in originResult) {
                if (testResult[x] === undefined)
                    return res.send(`0: test database does not have "${x}" table`)
            }
            
            for (var x in testResult) {
                if (originResult[x] === undefined)
                    return res.send(`0: test database has "${x}" table that not presented in origin`)
            }

            // check columns
            for (x in originResult) {
                let originRows = await originClient.query(`SELECT * FROM information_schema.COLUMNS WHERE TABLE_NAME = '${x}';`);
                originRows = originRows.rows
                    .reduce((acc, cur) => { acc[cur.column_name] = cur; return acc}, {}); 

                let testRows = await testClient.query(`SELECT * FROM information_schema.COLUMNS WHERE TABLE_NAME = '${x}';`);
                testRows = testRows.rows
                    .reduce((acc, cur) => { acc[cur.column_name] = cur; return acc}, {}); 
                
                for (var c in originRows) {
                    if (testRows[c] === undefined)
                        return res.send(`0: test database does not have "${c}" column in the "${x}" table`)
                    
                    let diff = [];
                    let neglect = {table_catalog:1, udt_catalog:1}
                    for (var p in originRows[c]) {
                        if (neglect[p] !== undefined) {
                            continue
                        }
                        if (originRows[c][p] !== testRows[c][p]) {
                            diff.push(`column "${c}"; property "${p}"; (origin - ${p} = ${JSON.stringify(originRows[c][p])} but test - ${p} = ${JSON.stringify(testRows[c][p])})\n`);
                        }                    
                    }
                    if (diff.length > 0) {
                        return res.send(`0: in table ${x} there are differences in props: ${diff}`)
                    }
                }

                for (var c in testRows) {
                    if (originRows[c] === undefined)
                        return res.send(`0: test table"${x}" has column "${c}" not presented in origin`)
                }
            }

            for (x in originResult) {
                let originIxs = await originClient.query(`SELECT indexname, indexdef FROM pg_indexes WHERE tablename = '${x}';`);    
                originIxs = originIxs.rows
                    .reduce((acc, cur) => { acc[cur.indexname] = cur; return acc}, {}); 

                let testIxs = await testClient.query(`SELECT indexname, indexdef FROM pg_indexes WHERE tablename = '${x}';`);    
                testIxs = testIxs.rows
                    .reduce((acc, cur) => { acc[cur.indexname] = cur; return acc}, {});

                for (var i in originIxs) {
                    if (testIxs[i] === undefined)
                        return res.send(`0: test database does not have "${c}" index in the "${x}" table (${JSON.stringify(originIxs[i])})`)
                    if (testIxs[i].indexdef !== originIxs[i].indexdef)
                        return res.send(`0: test database index "${i}" does not match with origin in table "${x}" (${originIxs[i].indexdef})`)
                }

                for (var i in testIxs) {
                    if (originIxs[i] === undefined)
                        return res.send(`0: test database has "${i}" index in the "${x}" table not presented in origin`)
                }
            }

            // check fks
            let originCons = await originClient.query(`SELECT
                tc.constraint_name, tc.table_name, kcu.column_name,
                rk.update_rule,
                rk.delete_rule,
                ccu.table_name AS foreign_table_name,
                ccu.column_name AS foreign_column_name 
            FROM 
                information_schema.table_constraints AS tc 
                JOIN information_schema.key_column_usage AS kcu
                  ON tc.constraint_name = kcu.constraint_name
                JOIN information_schema.constraint_column_usage AS ccu
                  ON ccu.constraint_name = tc.constraint_name
                JOIN information_schema.referential_constraints AS rk
                  ON tc.constraint_name = rk.constraint_name
            WHERE constraint_type = 'FOREIGN KEY'`);    
            originCons = originCons.rows
                .reduce((acc, cur) => { acc[cur.constraint_name] = cur; return acc}, {});

            let testCons = await testClient.query(`SELECT
                tc.constraint_name, tc.table_name, kcu.column_name,
                rk.update_rule,
                rk.delete_rule,
                ccu.table_name AS foreign_table_name,
                ccu.column_name AS foreign_column_name 
            FROM 
                information_schema.table_constraints AS tc 
                JOIN information_schema.key_column_usage AS kcu
                  ON tc.constraint_name = kcu.constraint_name
                JOIN information_schema.constraint_column_usage AS ccu
                  ON ccu.constraint_name = tc.constraint_name
                JOIN information_schema.referential_constraints AS rk
                  ON tc.constraint_name = rk.constraint_name
            WHERE constraint_type = 'FOREIGN KEY'`);   
            testCons = testCons.rows
                .reduce((acc, cur) => { acc[cur.constraint_name] = cur; return acc}, {});
                
            for (var c in originCons) {
                if (testCons[c] === undefined)
                    return res.send(`0: test database does not have "${c}" fk" (${JSON.stringify(originCons[c])})`)
                if (!_.isEqual(originCons[c], testCons[c])) {
                    return res.send(`0: test database has wrong fk "${c}" it needs to be like (${JSON.stringify(originCons[c])})`)
                }
            }

            return res.send('1: everythings ok!');
        } catch (err) {
            console.error(err);
            return res.send("Error " + err);
        }  
    })
    .get('/ping', async (req, res) => {     
        try {
            const client = await pool.connect();
            const result = await client.query(`select * from ping`);    
            return res.send(`"${result.rows[0].ping}"`);
        } catch (err) {
            console.error(err);
            return res.send("Error " + err);
        }   
    })
    .get('*', (req, res) => {
        return res.send('hello!');
    })
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))

    function exitIfNotAdmin(req, res) {
        if (req.query.internalsecret !== process.env.SECRET) {
            res.send('sorry but you need to specify secret key')
            return false;
        }
        return true;
    }