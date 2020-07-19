require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

const createEndpoints = require('./src/createEndpoints');
const { query, getConnection } = require('./src/db/query');
const handleHealth = require('./src/handlers/handleHealth');
const handleGetColors = require('./src/handlers/handleGetColors');
const handlePostColors = require('./src/handlers/handlePostColors');
const handleDeleteColor = require('./src/handlers/handleDeleteColor');

const app = express();
app.use(bodyParser.json({ type: 'application/json' }));
app.use(cors())

createEndpoints({
    handleHealth,
    handleGetColors,
    handlePostColors,
    handleDeleteColor,
    app,
    query,
    getConnection
});

app.listen(process.env.PORT, () => {
    console.log("Server is listening on 3000");
});
