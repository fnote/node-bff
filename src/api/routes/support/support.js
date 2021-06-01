/**
 * Exposes support related endpoints such as healthcheck
 *
 * @author: gkar5861 on 22/06/20
 * */

import * as HttpStatus from 'http-status-codes';
import {Router} from 'express';
import {CLOUD_PCI_BFF, CLOUD_PCI_BFF_VERSION} from '../../../util/constants';

export default () => {
    const supportRouter = new Router();
    supportRouter.get('/healthcheck', (req, res) => {
        const health = {
            appName: CLOUD_PCI_BFF,
            appVersion: CLOUD_PCI_BFF_VERSION,
        };
        res.status(HttpStatus.OK).json(health);
    });

    supportRouter.get('/status', (req, res) => {
        const version = {
            appName: CLOUD_PCI_BFF,
            appVersion: CLOUD_PCI_BFF_VERSION,
            uptime: process.uptime(),
            memoryUsage: process.memoryUsage(),
            nodeVersion: process.versions.node,
            nodeEnv: process.env.NODE_ENV,
        };
        res.status(HttpStatus.OK).json(version);
    });
    return supportRouter;
};
