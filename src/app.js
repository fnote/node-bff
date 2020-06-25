/**
 * Serverless App initialize
 *
 * */

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import serverless from "serverless-http";
import morgan from "morgan";
import * as HttpStatus from "http-status-codes";
import router from "./api";
import {handleError} from "./middleware/errorHandler";

const correlator = require("express-correlation-id");

const app = express();

// generate correlation id
app.use(correlator());

// setup the logger
morgan.token("correlationId", (req) => req.correlationId());
app.use(morgan(":method :url :status :res[content-length] - :response-time ms"));

app.use(cors());
app.use(bodyParser.json());

app.options("/*", (req, res) => {
    res.send(HttpStatus.OK);
});

app.get("/v1/", (req, res) => {
    res.send(`Cloud PCI bff is started. Environment: ${process.env.ENVIRONMENT}`);
});

app.use("/v1/pci-bff/", router);

// error handling middleware
app.use((err, req, res) => {
    handleError(err, res);
});

exports.serverlessApp = serverless(app);

exports.app = app;
