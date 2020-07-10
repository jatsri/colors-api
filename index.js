const express = require('express');

const createEndpoints = require('./createEndpoints');

const app = express();

createEndpoints({
    app
});

app.listen('3000', () => {
    console.log("Server is listening on 3000");
});
