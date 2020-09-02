/**
 * Pricing Data routes
 *
 * @author: adis0892 on 03/08/20
 * */

import {Router} from 'express';
import * as HttpStatus from 'http-status-codes';
import AggregatedPricingDataService from '../../../service/pricing/aggregatedPricingDataService';
import logger from '../../../util/logger';
import {createErrorResponse} from '../../../mapper/responseMapper';
import BusinessUnitAuthorization from '../../../service/auth/businessUnitAuthorization';

export default () => {
    const cloudPricingRouter = new Router({mergeParams: true});

    cloudPricingRouter.post('/pricing-data', async (req, res) => {
        try {
            const isAuthorized = BusinessUnitAuthorization.isAuthorizedRequest(req, res);

            if(isAuthorized) {
                const responseData = await AggregatedPricingDataService.getAggregatedPricingData(req);
                res.status(HttpStatus.OK).send(responseData);
            } else {
                res.status(HttpStatus.UNAUTHORIZED).send(createErrorResponse('Unauthorized',
                    'User is not authorized to perform this action/ for the requested opco',
                    null, 'User authorization validations failed'));
            }
        } catch (error) {
            const errMessage = 'Error occurred in getting pricing related data';
            logger.error(`${errMessage}: ${error} cause: ${error.stack}`);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .send(createErrorResponse(null, errMessage, error, null));
        }
    });
    return cloudPricingRouter;
};
