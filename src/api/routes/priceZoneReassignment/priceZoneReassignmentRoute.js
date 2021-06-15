 import {Router} from 'express';
 import * as HttpStatus from 'http-status-codes';
 import logger from '../../../util/logger';
 import {createErrorResponse} from '../../../mapper/responseMapper';
 import AuthorizationService from '../../../service/auth/authorizationService';
 import SeedDataService from '../../../service/seed/seedDataService';
 import {CORRELATION_ID_HEADER} from '../../../util/constants';
 import {getCorrelationId} from '../../../util/correlationIdGenerator';
import SeedApiDataFetchException from '../../../exception/seedApiDataFechException';

export default () => {
     const priceZoneReassignmentRouter = new Router();

     priceZoneReassignmentRouter.get('/item-attribute-groups', async (req, res) => {
         try {
             const isAuthorized = AuthorizationService.isAuthorizedRequest(req, res);
             if (isAuthorized) {
                const responseData = await SeedDataService.getSeedItemAttributeGroupsData();
                logger.info(`Success Seed Data response received: ${JSON.stringify(responseData)}`);
                res.set(CORRELATION_ID_HEADER, getCorrelationId());
                res.status(HttpStatus.OK)
                    .send(responseData);
             } else {
                 res.status(HttpStatus.UNAUTHORIZED).send(createErrorResponse('Unauthorized',
                     'User is not authorized to perform this action in the requested opco',
                     null, 'User authorization validations failed'));
             }
         } catch (error) {
             const errMessage = 'Error occurred in getting Seed API item attribute group data';
             logger.error(`${errMessage}: ${error} cause: ${error.stack} errorCode: ${error.errorCode}`);
             let httpStatusCode;
             if (error instanceof SeedApiDataFetchException) {
                 httpStatusCode = HttpStatus.BAD_REQUEST;
             } else {
                 httpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR;
             }
             res.set(CORRELATION_ID_HEADER, getCorrelationId());
             res.status(httpStatusCode)
                 .send(createErrorResponse(null, errMessage, error, null, error.errorCode));
         }
     });
     return priceZoneReassignmentRouter;
 };
