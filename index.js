require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const createEndpoints = require('./src/createEndpoints');
const { query } = require('./src/db/query');

const app = express();
app.use(bodyParser.json({ type: 'application/json' }));

createEndpoints({
    app,
    query
});

app.listen(process.env.PORT, () => {
    console.log("Server is listening on 3000");
});
