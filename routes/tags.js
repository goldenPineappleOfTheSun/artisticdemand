var express = require('express');
const pool = require('./pool');
var router = express.Router();

router.get('/', async (req, res) => {
    // contract
    let name = req.query.name;

    if (name === undefined) {
        return res.status(500).send({ error: 'please specify name' });
    }

    // query
    try {
        const client = await pool.connect();
        const result = await client.query(`select * from tag where name = '${name}'`);
        return res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: err });
    }
});

router.put('/', async (req, res) => {
    // contract
    if (req.body.internalsecret !== process.env.SECRET) {
        return res.status(500).send({ error: 'sorry but you need to specify secret key' });
    }

    let tag = req.body.tag;

    if (tag.name === undefined) {
        return res.status(500).send({ error: 'need to specify name' });
    }

    let name = tag.name;
    let title = tag.title || name;
    let defvalue = tag.defvalue || false;

    // query
    try {
        const client = await pool.connect();
        await client.query(`insert into tag (name, defvalue, title) values ('${name}', ${defvalue}, '${title}');`);
        return res.send('tag was inserted');
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: err });
    }
});

router.get('/all', async (req, res) => {
    // contract

    let pagesize = parseInt(req.query.pagesize, 10);
    let page = parseInt(req.query.page, 10);

    if (!isNaN(pagesize) && pagesize > 200) {
        return res.status(500).send({ error: 'pagesize must be smaller than 200' });
    }

    if (!isNaN(pagesize) && pagesize < 1) {
        return res.status(500).send({ error: 'pagesize must be bigger than 0' });
    }

    try {
        let paging = (!isNaN(pagesize))
            ? `limit ${pagesize} offset ${pagesize * (page || 0)}`
            : 'limit 200';

        const client = await pool.connect();
        const result = await client.query(`select * from tag ${paging}`);
        return res.send({
            count: result.rowCount,
            rows: result.rows,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: err });
    }
});

module.exports = router;
