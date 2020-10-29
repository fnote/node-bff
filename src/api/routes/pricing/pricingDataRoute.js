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
import AuthorizationService from '../../../service/auth/authorizationService';
import {
    PRICING_DATA_INVALID_PAYLOAD_ERROR_CODE, PCI_PRICE_DATA_FETCH_ERROR_CODE,
    PRODUCT_PRICE_DATA_FETCH_ERROR_CODE, PRODUCT_INFO_DATA_FETCH_ERROR_CODE
} from '../../../exception/exceptionCodes';

export default () => {
    const cloudPricingRouter = new Router({mergeParams: true});

    cloudPricingRouter.post('/pricing-data', async (req, res) => {
        try {
            const isAuthorized = AuthorizationService.isAuthorizedRequest(req, res);

            if (isAuthorized) {
                const responseData = await AggregatedPricingDataService.getAggregatedPricingData(req);
                logger.debug("Success response received");
                res.status(HttpStatus.OK)
                    .send(responseData);
            } else {
                res.status(HttpStatus.UNAUTHORIZED).send(createErrorResponse('Unauthorized',
                    'User is not authorized to perform this action in the requested opco',
                    null, 'User authorization validations failed'));
            }
        } catch (error) {
            const errMessage = 'Error occurred in getting pricing related data';
            logger.error(`${errMessage}: ${error} cause: ${error.stack} errorCode: ${error.errorCode}`);
            let httpStatusCode;
            switch (error.errorCode) {
                case PRICING_DATA_INVALID_PAYLOAD_ERROR_CODE:
                case PCI_PRICE_DATA_FETCH_ERROR_CODE:
                case PRODUCT_PRICE_DATA_FETCH_ERROR_CODE:
                case PRODUCT_INFO_DATA_FETCH_ERROR_CODE:
                    httpStatusCode = HttpStatus.BAD_REQUEST;
                    break;
                default:
                    httpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR;
                    break;
            }
            res.status(httpStatusCode)
                .send(createErrorResponse(null, errMessage, error, null, error.errorCode));
        }
    });
    return cloudPricingRouter;
};
