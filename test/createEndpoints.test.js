const { expect } = require('chai');
const request = require('supertest');
const express = require('express');
const sinon  = require('sinon');
require('chai').use(require('sinon-chai'));

const createEndpoints = require('../src/createEndpoints');

const app = express();
const query = sinon.spy();
const getConnection = sinon.spy();
const handleHealth = sinon.stub().throws();
const handleGetColors = sinon.stub().throws();
const handlePostColors =sinon.stub().throws();
const handleDeleteColor = sinon.stub().throws();


const createApp = () => {
    createEndpoints({
        handleHealth,
        handleGetColors,
        handlePostColors,
        handleDeleteColor,
        app,
        query
    });
    app.use((err, req, res, next) => res.status(210).send());
    return app;
}

describe('createEndpoints', () => {
    it('should call /health endpoint',  async () => {
        const app = createApp();

        await request(app).get('/health');

        expect(handleHealth).to.have.been.calledOnce;
    });

    it('should call handleGetColors to get colors', async () => {
        const app = createApp();

        const res = await request(app).get('/colors');

        expect(handleGetColors).to.have.been.calledOnce;
    });

    it('should call handlePostColors to post new colors', async () => {
        const app = createApp();

        const res = await request(app).post('/colors');

        expect(handlePostColors).to.have.been.calledOnce;
    });

    it('should call handledeleteColors to delete a color', async () => {
        const app = createApp();

        const res = await request(app).delete('/colors/5');

        expect(handleDeleteColor).to.have.been.calledOnce;
    });
});
