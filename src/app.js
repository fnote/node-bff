/**
 * Serverless App initialize
 *
 **/

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import serverless from 'serverless-http';
import router from './api';
import * as morgan from 'morgan';
import {handleError} from './middleware/errorHandler';
import fs from 'fs';

const rfs = require('rotating-file-stream');

const app = express();

// create a rotating write stream
const logs_dir = '/tmp/logs';
if (!fs.existsSync(logs_dir)) {
    fs.mkdir(logs_dir, {recursive: true}, (err) => {
        if (err) {
            console.log(err)
        }
    });
}
const logStream = rfs.createStream('cloud-pci-bff.log', {
    interval: '1d', // rotate daily
    path: logs_dir
});

// setup the logger
app.use(morgan('combined', {stream: logStream}));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use(cors());
app.use(bodyParser.json());

app.options('/*', (req, res) => {
    res.send(HttpStatus.OK);
});

app.get('/v1/', (req, res) => {
    res.send(`Cloud PCI bff is started. Environment: ${process.env.ENVIRONMENT}`);
});

app.use('/v1/pci-bff/', router);

// error handling middleware
app.use((err, req, res, next) => {
    handleError(err, res);
});

exports.serverlessApp = serverless(app);

exports.app = app;
