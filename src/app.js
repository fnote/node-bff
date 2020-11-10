/**
 * Serverless App initialize
 *
 * */

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import serverless from 'serverless-http';
import morgan from 'morgan';
import router from './api';
import {handleError} from './middleware/errorHandler';
import {authMiddleware} from './middleware/authMiddleware';
import {initializer} from './initializer';
import { CORRELATION_ID_HEADER } from './util/constants';
import { correlatorMiddleware } from './util/correlationIdGenerator';

const app = express();

// middleware to set a correlation id per route in express
app.use(correlatorMiddleware({ header: CORRELATION_ID_HEADER }));

app.use(initializer);

// setup the logger
morgan.token('correlationId', (req) => req.correlationId());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use(cors({credentials: true, origin: true}));

app.use(bodyParser.json());

app.use(authMiddleware);

app.use('/v1/pci-bff/', router);

// error handling middleware
app.use((err, req, res, next) => {
    handleError(err, req, res);
});

exports.serverlessApp = serverless(app);

exports.app = app;
