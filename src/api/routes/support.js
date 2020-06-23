/**
 * Exposes support related endpoints such as healthcheck
 *
 * @author: gkar5861 on 22/06/20
 **/

import {CLOUD_PCI_BFF, CLOUD_PCI_BFF_VERSION} from "../../util/constants";
import * as HttpStatus from "http-status-codes";
import router from "../index";
import {Router} from "express";

export default () => {
    const supportRouter = new Router();
    supportRouter.get('/healthcheck', (req, res) => {
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
    return supportRouter;
}