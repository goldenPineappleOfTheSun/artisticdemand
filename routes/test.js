var express = require('express');
const pool = require('./pool');
const path = require('path');
var router = express.Router();

/**
 * Opens up unit testing pageZ
 * @return {HTML file}
 */
router.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '../sillytests/test.html'));
});

/**
 * Return result of ping
 * @return {string}
 */
router.get('/ping', async (req, res) => {
    let client;
    try {
        client = await pool.connect();

        const result = await client.query('select * from ping');
        return res.send(`"${result.rows[0].ping}"`);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: err });
    } finally {
        client.close();
    }
});

/**
 * Prepares tags for testing
 * @throws {400 Test config needed} If server is not in test mode
 * @throws {400 No secret key} If internalsecret param is not correct
 */
router.get('/prepareTags', async (req, res) => {
    // contract
    if (process.env.NODE_ENV !== 'test') {
        return res.status(400).send({ error: 'Для этого надо запускать тестовую конфигурацию' });
    }

    if (req.query.internalsecret !== process.env.SECRET) {
        return res.status(400).send({ error: 'Sorry but you need to specify the secret key' });
    }

    // insert
    let client;
    try {
        client = await pool.connect();


        await client.query(`delete from tag;
            INSERT INTO tag (name, defvalue, title) 
            SELECT 
            unnest(array['first', 'second', 'third']), 
            unnest(array[true, true, false]), 
            unnest(array['Первый', 'Второй', 'Третий']);`);

        return res.end();
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: err });
    } finally {
        client.close();
    }
});
module.exports = router;
