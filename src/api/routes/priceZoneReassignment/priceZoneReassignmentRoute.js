 import {Router} from 'express';
 import * as HttpStatus from 'http-status-codes';
 import logger from '../../../util/logger';
 import {createErrorResponse} from '../../../mapper/responseMapper';
 import SeedDataService from '../../../service/seed/seedDataService'
 import PriceZoneReassignmentService from '../../../service/priceZoneReassignment/priceZoneReassignmentService'
 import {CORRELATION_ID_HEADER} from '../../../util/constants';
 import {getCorrelationId} from '../../../util/correlationIdGenerator';
import SeedApiDataFetchException from '../../../exception/seedApiDataFechException';
import CipzApiDataFetchException from '../../../exception/cipzApiDataFetchException';

 export default () => {

     const priceZoneReassignmentRouter = new Router();

     priceZoneReassignmentRouter.get('/item-attribute-groups', async (req, res) => {

         try {
                const responseData = await SeedDataService.getSeedItemAttributeGroupsData();
                logger.info(`Success Seed Data response received: ${JSON.stringify(responseData)}`);
                res.set(CORRELATION_ID_HEADER, getCorrelationId());
                res.status(HttpStatus.OK).send(responseData);

         } catch (error) {

             const errorMsg = 'Error occurred in getting Seed API item attribute group data';
             logger.error(`${errorMsg} : ${error} cause : ${error.stack} errorCode : ${error.errorCode}`);
             let httpResponseStatusCode  = (error instanceof SeedApiDataFetchException) ? HttpStatus.BAD_REQUEST
              : HttpStatus.INTERNAL_SERVER_ERROR;
             res.set(CORRELATION_ID_HEADER, getCorrelationId());
             res.status(httpResponseStatusCode)
                 .send(createErrorResponse(null, errorMsg, error, null, error.errorCode));
         }
     });


     priceZoneReassignmentRouter.get('/pz-update-requests', async (req, res) => {

        try {
               const responseData = await PriceZoneReassignmentService.getCIPZSubmittedRequestData(req.query);
               logger.info(`Success CIPZ submitted requets Data response received: ${JSON.stringify(responseData)}`);
               res.set(CORRELATION_ID_HEADER, getCorrelationId());
               res.status(HttpStatus.OK).send(responseData);

        } catch (error) {

            const errorMsg = 'Error occurred in getting CIPZ API submitted requests data';
            logger.error(`${errorMsg} : ${error} cause : ${error.stack} errorCode : ${error.errorCode}`);
            let httpResponseStatusCode  = (error instanceof CipzApiDataFetchException) ? HttpStatus.BAD_REQUEST
             : HttpStatus.INTERNAL_SERVER_ERROR;
            res.set(CORRELATION_ID_HEADER, getCorrelationId());
            res.status(httpResponseStatusCode)
                .send(createErrorResponse(null, errorMsg, error, null, error.errorCode));
        }
    });

    priceZoneReassignmentRouter.get('/pz-updates/:request_id', async (req, res) => {

        try {

               let requestId = req.params.request_id;
               const responseData = await PriceZoneReassignmentService.getPriceZoneUpdatesData(req.query, requestId);
               logger.info(`Success CIPZ API Price Zone Updates Data response received: ${JSON.stringify(responseData)}`);
               res.set(CORRELATION_ID_HEADER, getCorrelationId());
               res.status(HttpStatus.OK).send(responseData);

        } catch (error) {

            const errorMsg = 'Error occurred in getting CIPZ API Price Zone Updates data';
            logger.error(`${errorMsg} : ${error} cause : ${error.stack} errorCode : ${error.errorCode}`);
            let httpResponseStatusCode  = (error instanceof CipzApiDataFetchException) ? HttpStatus.BAD_REQUEST
             : HttpStatus.INTERNAL_SERVER_ERROR;
            res.set(CORRELATION_ID_HEADER, getCorrelationId());
            res.status(httpResponseStatusCode)
                .send(createErrorResponse(null, errorMsg, error, null, error.errorCode));
        }
    });
     return priceZoneReassignmentRouter;
 };
