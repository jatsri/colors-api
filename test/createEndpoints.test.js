const { expect } = require('chai');
const request = require('supertest');
const express = require('express');
const sinon  = require('sinon');

const createEndpoints = require('../src/createEndpoints');

const response = { rows: [ { id: 1, name: 'red', hex: '#REDCOL' }]};

const createApp = () => {
    const app = express();
    const query = sinon.stub().resolves(response)

    createEndpoints({ app, query });
    return app;
}

describe('createEndpoints', () => {
    it('should call /health endpoint', async () => {
        const app = createApp();

        const res = await request(app).get('/health');

        expect(res.status).to.equal(200);
        expect(res.text).to.equal('Healthy');
    });

    it('should return colors on get to /colors', async () => {
        const app = createApp();

        const res = await request(app).get('/colors');

        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal({ items: response.rows });
    });
});
