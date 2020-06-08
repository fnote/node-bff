/**
 * App routes index class
 *
 * @author: gkar5861 on 04/06/20
 **/
import express from "express";
import {PCI_GRABBER_BFF, PCI_GRABBER_BFF_VERSION} from "../util/constants";
import * as HttpStatus from "http-status-codes";

const router = express.Router();

// add routes here

// Health check API
router.get('/healthcheck', (req, res) => {
    const health = {
        appVersion: PCI_GRABBER_BFF_VERSION,
        appName: PCI_GRABBER_BFF,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        nodeVersion: process.versions.node,
        nodeEnv: process.env.NODE_ENV,
    };
    res.status(HttpStatus.OK).json(health);
});

export default router;
