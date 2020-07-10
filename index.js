require('dotenv').config();
const express = require('express');

const createEndpoints = require('./createEndpoints');

const app = express();

createEndpoints({
    app
});

app.listen(process.env.PORT, () => {
    console.log("Server is listening on 3000");
});
