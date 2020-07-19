const asyncHandler = require('express-async-handler');

const createEndpoints = ({
    app,
    query,
    getConnection,
    handleHealth,
    handleGetColors,
    handlePostColors,
    handleDeleteColor,
}) => {
    app.get('/health', asyncHandler(handleHealth));

    app.get('/colors', asyncHandler(handleGetColors.bind(null, { query })));

    app.post('/colors', asyncHandler(handlePostColors.bind(null, { getConnection })));

    app.delete('/colors/:id', asyncHandler(handleDeleteColor.bind(null, { query })))
}

module.exports = createEndpoints;
