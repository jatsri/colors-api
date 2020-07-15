require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

const createEndpoints = require('./src/createEndpoints');
const { query, getConnection } = require('./src/db/query');

const app = express();
app.use(bodyParser.json({ type: 'application/json' }));
app.use(cors())

createEndpoints({
    app,
    query,
    getConnection
});

app.listen(process.env.PORT, () => {
    console.log("Server is listening on 3000");
});
