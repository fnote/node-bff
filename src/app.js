/**
 * Serverless App initialize
 *
 * */

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import serverless from 'serverless-http';
import morgan from 'morgan';
import * as HttpStatus from 'http-status-codes';
import router from './api';
import {handleError} from './middleware/errorHandler';
import {authMiddleware} from './middleware/authMiddleware';
import {initializer} from './initializer';

const correlator = require('express-correlation-id');

const app = express();

// generate correlation id
app.use(correlator());

app.use(initializer);

// setup the logger
morgan.token('correlationId', (req) => req.correlationId());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use(cors({credentials: true, origin: true}));

app.use(bodyParser.json());

app.options('/*', (req, res) => {
    res.send(HttpStatus.OK);
});

app.use(authMiddleware);

app.use('/v1/pci-bff/', router);

// error handling middleware
app.use((err, req, res, next) => {
    handleError(err, req, res, next);
});

exports.serverlessApp = serverless(app);

exports.app = app;
