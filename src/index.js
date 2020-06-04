/**
 * Serverless App initialize
 *
 * @author: gkar5862 on 03/06/20
 **/

import express from 'express';
import serverless from 'serverless-http';
import HttpStatus from 'http-status-codes';

const app = express();

app.options('/*', (req, res) => {
    res.send(HttpStatus.OK);
});

app.get('/v1/', (req, res) => {
    console.log(`PCI-Grabber bff is started. Environment: ${process.env.ENVIRONMENT_NAME}`);
    res.send(`PCI-Grabber bff is started. Environment: ${process.env.ENVIRONMENT_NAME}`);
});

app.listen(console.log(`App listening at http://localhost:${process.env.PORT}`))

exports.serverlessApp = serverless(app);

exports.app = app;
