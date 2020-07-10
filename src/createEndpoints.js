const asyncHandler = require('express-async-handler');

const  colors = require('./colors');

const createEndpoints = ({ app, query }) => {
    app.get('/health', (req, res) => {
        res.send('Healthy')
    });

    app.get('/colors', asyncHandler(async (req, res) => {
        const result = await query(`SELECT * FROM colors_hex`);

        res.json({ items: result.rows})
    }))
}

module.exports = createEndpoints;
