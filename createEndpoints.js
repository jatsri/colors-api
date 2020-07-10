const createEndpoints = ({ app }) => {
    app.get('/health', (req, res) => {
        res.send('Healthy')
    });
}

module.exports = createEndpoints;
