var express = require('express');
const pool = require('./pool');
const path = require('path');
var router = express.Router();

router.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '../test.html'));
});

router.get('/ping', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('select * from ping');
        return res.send(`"${result.rows[0].ping}"`);
    } catch (err) {
        console.error(err);
        return res.send('Error ' + err);
    }
});

router.get('/prepareTags', async (req, res) => {
    try {
        // contract
        if (process.env.NODE_ENV !== 'test') {
            return res.send('Для этого надо запускать тестовую конфигурацию');
        }

        if (exitIfNotAdmin(req, res) === false){
            return;
        };

        // insert
        const client = await pool.connect();

        await client.query(`delete from tag;
            INSERT INTO tag (name, defvalue, title) 
            SELECT 
            unnest(array['first', 'second', 'third']), 
            unnest(array[true, true, false]), 
            unnest(array['Первый', 'Второй', 'Третий']);`);

        return res.end();
    } catch (err) {
        console.error(err);
        return res.send('Error ' + err);
    }
});

function exitIfNotAdmin(req, res) {
    if (req.query.internalsecret !== process.env.SECRET) {
        res.send('sorry but you need to specify secret key');
        return false;
    }
    return true;
}

module.exports = router;
