var express = require('express');
const pool = require('./pool');
var router = express.Router();

/**
 * Loads all tags by filter using paging. Max page size is 200
 * @throws {400 Pagesize} If pagesize is smaller than 1
 * @throws {400 Pagesize} If pagesize is bigger than 200
 * @return {count:number, rows:tag[]}
 */
router.get('/:template?', async (req, res) => {
    // get
    let pagesize = parseInt(req.query.pagesize, 10);
    let page = parseInt(req.query.page, 10);

    if (!isNaN(pagesize) && pagesize > 200) {
        return res.status(400).send({ error: 'Pagesize must be smaller than 200' });
    }

    if (!isNaN(pagesize) && pagesize < 1) {
        return res.status(400).send({ error: 'Pagesize must be bigger than 0' });
    }

    let client;
    try {
        let paging = (!isNaN(pagesize))
            ? `limit ${pagesize} offset ${pagesize * (page || 0)}`
            : 'limit 200';

        client = await pool.connect();
        let filter = [];

        if (req.params.template !== 'all') {
            if (req.query.name)
                filter.push(`name='${req.query.name}'`);
            if (req.query.id)
                filter.push(`id=${req.query.id}`);
            if (req.query.defvalue)
                filter.push(`defvalue=${req.query.defvalue}`);
            if (req.query.title)
                filter.push(`title='${req.query.title}'`);
            filter = `where ${filter.join(' and ')}`;
        } else {
            filter = '';
        }

        let query = `select * from tag ${filter} ${paging}`;

        if (req.query.diagnostics === '1') {
            console.log(query);
        }

        const result = await client.query(query);

        res.status(200).send({
            count: result.rowCount,
            rows: result.rows,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: err });
    } finally {
        client.end();
    }
});

/**
 * Loads all tags using paging. Max page size is 200
 * @throws {400 Pagesize} If pagesize is smaller than 1
 * @throws {400 Pagesize} If pagesize is bigger than 200
 * @return {Tag[]}
 *//*
router.get('/all', async (req, res) => {
    // contract

    let pagesize = parseInt(req.query.pagesize, 10);
    let page = parseInt(req.query.page, 10);

    if (!isNaN(pagesize) && pagesize > 200) {
        return res.status(400).send({ error: 'Pagesize must be smaller than 200' });
    }

    if (!isNaN(pagesize) && pagesize < 1) {
        return res.status(400).send({ error: 'Pagesize must be bigger than 0' });
    }

    let client;
    try {
        let paging = (!isNaN(pagesize))
            ? `limit ${pagesize} offset ${pagesize * (page || 0)}`
            : 'limit 200';

        client = await pool.connect();
        const result = await client.query(`select * from tag ${paging}`);
        return res.send({
            count: result.rowCount,
            rows: result.rows,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: err });
    } finally {
        client.end();
    }
});*/

/**
 * Puts one tag in the base
 * @throws {400 No secret key} If internalsecret param is not correct
 * @throws {400 No name} If name is not presented
 */
router.put('/', async (req, res) => {
    // contract
    if (req.body.internalsecret !== process.env.SECRET) {
        return res.status(400).send({ error: 'Sorry but you need to specify the secret key' });
    }

    let tag = req.body.tag;

    if (tag.name === undefined) {
        return res.status(400).send({ error: 'Need to specify name' });
    }

    let name = tag.name;
    let title = tag.title || name;
    let defvalue = tag.defvalue || false;

    // query
    let client;
    try {
        client = await pool.connect();
        await client.query(`insert into tag (name, defvalue, title) values ('${name}', ${defvalue}, '${title}');`);
        return res.sendStatus(200);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: err });
    } finally {
        client.end();
    }
});

/**
 * Puts multiple tags the base (max 50)
 * @throws {400 No secret key} If internalsecret param is not correct
 * @throws {400 No array} If array presented
 * @throws {400 Too many} If array is bigger than 50
 * @throws {400 invalid array} If some values in array is not right
 */
router.post('/', async (req, res) => {
    // inputs and contracts
    if (req.body.internalsecret !== process.env.SECRET) {
        return res.status(400).send({ error: 'Sorry but you need to specify the secret key' });
    }

    let arr = req.body.arr;

    if (arr === undefined) {
        return res.status(400).send({ error: 'Need to specify array "arr"' });
    }

    if (arr.length === 0) {
        return res.status(200).send('No rows to put!');
    }

    if (arr.length > 50) {
        return res.status(400).send({ error: 'Too many rows' });
    }

    let names = [];
    let defvalues = [];
    let titles = [];
    try {
        names = arr.map(x => {
            if (typeof x.name !== 'string') {
                throw new Error('Need to specify name for all the tags');
            } else {
                return x.name;
            }
        });
        defvalues = arr.map(x => x.defvalue || false);
        titles = arr.map(x => x.title || x.name);
    } catch (err) {
        return res.status(400).send({ error: err });
    }

    // query
    let client;
    try {
        client = await pool.connect();
        await client.query(`INSERT INTO tag (name, defvalue, title)
            VALUES (
                UNNEST(ARRAY[${names.map(x => `'${x}'`).join(',')}]), 
                UNNEST(ARRAY[${defvalues.join(',')}]), 
                UNNEST(ARRAY[${titles.map(x => `'${x}'`).join(',')}])
            );`);
        return res.sendStatus(200);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: err });
    } finally {
        client.end();
    }
});

/**
 * Deletes tag from base
 * @throws {400 No secret key} If internalsecret param is not correct
 * @throws {400 No id} If name or id for identification is not presented
 */
router.delete('/', async (req, res) => {
    // inputs and contracts
    if (req.body.internalsecret !== process.env.SECRET) {
        return res.status(400).send({ error: 'Sorry but you need to specify the secret key' });
    }

    let tag = req.body.tag;

    if (tag.name === undefined && tag.id === undefined) {
        return res.status(400).send({ error: 'Need to specify id or name' });
    }

    // query
    let client;
    try {
        client = await pool.connect();
        let filter = tag.id !== undefined ? `id = ${tag.id}` : `name = ${tag.name}`;
        await client.query(`delete from tag where ${filter};`);
        return res.sendStatus(200);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: err });
    } finally {
        client.end();
    }
});

/**
 * Patches tag in base
 * @throws {400 No secret key} If internalsecret param is not correct
 * @throws {400 No id} If name or id for identification is not presented
 * @throws {400 No changes} If tag contains no changes
 */
router.patch('/', async (req, res) => {
    // inputs and contracts
    if (req.body.internalsecret !== process.env.SECRET) {
        return res.status(400).send({ error: 'Sorry but you need to specify the secret key' });
    }

    let tag = req.body.tag;
    let changes = [[], []];

    if (tag.name === undefined && tag.id === undefined) {
        return res.status(400).send({ error: 'Need to specify id or name' });
    }

    if (tag.defvalue !== undefined) {
        changes[0].push('defvalue');
        changes[1].push(tag.defvalue);
    }

    if (tag.title !== undefined) {
        changes[0].push('title');
        changes[1].push(`'${tag.title}'`);
    }

    if (changes[0].length === 0) {
        return res.status(400).send({ error: 'No changes' });
    }

    // query
    let client;
    try {
        client = await pool.connect();
        let filter = tag.id !== undefined ? `id = ${tag.id}` : `name = '${tag.name}'`;
        let changesText = `(${changes[0].join()}) = (${changes[1].join()})`;

        await client.query(`update tag set ${changesText} where ${filter};`);
        return res.sendStatus(200);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: err });
    } finally {
        client.end();
    }
});

module.exports = router;
