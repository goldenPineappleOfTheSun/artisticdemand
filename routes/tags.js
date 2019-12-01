var express = require('express');
const pool = require('./pool');
var router = express.Router();

router.get('/all', async (req, res) => {
    try {
        let pagesize = parseInt(req.query.pagesize, 10);
        let page = parseInt(req.query.page, 10);

        if (!isNaN(pagesize) && pagesize > 200) {
            res.status(500).send({ error: 'pagesize must be smaller than 200' });
        }

        if (!isNaN(pagesize) && pagesize < 1) {
            res.status(500).send({ error: 'pagesize must be bigger than 0' });
        }

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
        return res.send('Error ' + err);
    }
});

module.exports = router;
