/**
 * App routes index class
 *
 * @author: gkar5861 on 04/06/20
 **/
import express from "express";
import {CLOUD_PCI_BFF, CLOUD_PCI_BFF_VERSION} from "../util/constants";
import * as HttpStatus from "http-status-codes";

const router = express.Router();

// add routes here

// Health check API
router.get('/healthcheck', (req, res) => {
    const health = {
        appVersion: CLOUD_PCI_BFF_VERSION,
        appName: CLOUD_PCI_BFF,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        nodeVersion: process.versions.node,
        nodeEnv: process.env.NODE_ENV,
    };
    res.status(HttpStatus.OK).json(health);
});

export default router;
