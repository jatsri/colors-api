const  colors = require('./colors');

const createEndpoints = ({ app }) => {
    app.get('/health', (req, res) => {
        res.send('Healthy')
    });

    app.get('/colors', (req, res) => {
        res.json(colors);
    })
}

module.exports = createEndpoints;
