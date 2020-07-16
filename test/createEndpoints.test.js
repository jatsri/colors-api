const { expect } = require('chai');
const request = require('supertest');
const express = require('express');

const createEndpoints = require('../src/createEndpoints');

const createApp = () => {
    const app = express();
    createEndpoints({ app });
    return app;
}

describe('createEndpoints', () => {
    it('should call /health endpoint', async () => {
        const app = createApp();

        const res = await request(app).get('/health');

        expect(res.status).to.equal(200);
        expect(res.text).to.equal('Healthy');
    });
});
