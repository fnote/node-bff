import {Router} from 'express';
import * as HttpStatus from 'http-status-codes';
import logger from '../../../util/logger';
import {createErrorResponse} from '../../../mapper/responseMapper';
import AuthorizationService from '../../../service/auth/authorizationService';
import SeedDataService from '../../../service/seed/seedDataService';
import PriceZoneReassignmentService from '../../../service/priceZoneReassignment/priceZoneReassignmentService';
import {CORRELATION_ID_HEADER, INVALID_REQUEST_BODY} from '../../../util/constants';
import {getCorrelationId} from '../../../util/correlationIdGenerator';
import SeedApiDataFetchException from '../../../exception/seedApiDataFechException';
import InvalidRequestException from '../../../exception/invalidRequestException';
import {PRICE_ZONE_REASSIGNMENT_INVALID_SEARCH_PAYLOAD_ERROR_CODE} from '../../../exception/exceptionCodes';
import {priceZoneReassignmentSearchReqBody} from '../../../validator/schema';
import CipzApiDataFetchException from '../../../exception/cipzApiDataFetchException';
const url = require('url');
const querystring = require('querystring');

export default () => {
    const priceZoneReassignmentRouter = new Router();

    const handleUnauthorizedRequest = (res) => {
        res.status(HttpStatus.UNAUTHORIZED).send(createErrorResponse('Unauthorized',
                        'User is not authorized to perform this action in the requested opco',
                        null, 'User authorization validations failed'));
    };

    const handleSuccessResponse = (res, responseData) => {
        res.set(CORRELATION_ID_HEADER, getCorrelationId());
                res.status(HttpStatus.OK)
                    .send(responseData);
    };

    const generateHttpStatusCode = (error) => {
        if (error instanceof SeedApiDataFetchException || error instanceof InvalidRequestException) {
            return HttpStatus.BAD_REQUEST;
        }
        return HttpStatus.INTERNAL_SERVER_ERROR;
    };

    const handleUnsuccessfulResponse = (res, error, errorMessage) => {
        const httpStatusCode = generateHttpStatusCode(error);
        res.set(CORRELATION_ID_HEADER, getCorrelationId());
        res.status(httpStatusCode)
            .send(createErrorResponse(null, errorMessage, error, null, error.errorCode));
    };

    priceZoneReassignmentRouter.get('/item-attribute-groups', async (req, res) => {
        try {
            const isAuthorized = AuthorizationService.isAuthorizedRequest(req, res);
            if (isAuthorized) {
                const responseData = await SeedDataService.getSeedItemAttributeGroupsData();
                logger.info(`Success Seed Data response received: ${JSON.stringify(responseData)}`);
                handleSuccessResponse(res, responseData);
            } else {
                handleUnauthorizedRequest(res);
            }
        } catch (error) {
            const errMessage = 'Error occurred in getting Seed API item attribute group data';
            logger.error(`${errMessage}: ${error} cause: ${error.stack} errorCode: ${error.errorCode}`);
            handleUnsuccessfulResponse(res, error, errMessage);
        }
    });

    priceZoneReassignmentRouter.get('/pz-update-requests', async (req, res) => {

        try {
               const responseData = await PriceZoneReassignmentService.getCIPZSubmittedRequestData(req.query.page, req.query.limit, req.query.offset);
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

    const isCustomerAccountDefined = ({ customerAccount }) => !!customerAccount;
    const validateSearchRequest = ({ body }) => {
        const { error } = priceZoneReassignmentSearchReqBody.validate(body);
        if (error) {
            throw new InvalidRequestException(
                INVALID_REQUEST_BODY,
                HttpStatus.BAD_REQUEST,
                PRICE_ZONE_REASSIGNMENT_INVALID_SEARCH_PAYLOAD_ERROR_CODE,
            );
        }
    };

    priceZoneReassignmentRouter.post('/search', async (req, res) => {
        try {
            const isAuthorized = AuthorizationService.isAuthorizedRequest(req, res);
            if (isAuthorized) {
                validateSearchRequest(req);
                let responseData;
                if (isCustomerAccountDefined(req.body)) {
                    responseData = await SeedDataService.getPriceZoneDetailsForCustomerAndItemAttributeGroup(req);
                } else {
                    responseData = await SeedDataService.getPriceZoneDetailsForCustomerGroupAndItemAttributeGroup(req);
                }
                logger.info(`Success Seed Data response received for search: ${JSON.stringify(responseData)}`);
                handleSuccessResponse(res, responseData);
            } else {
                handleUnauthorizedRequest(res);
            }
        } catch (error) {
            const errMessage = 'Error occurred while searching Seed API for customer & item-attribute-group data';
            logger.error(`${errMessage}: ${error} cause: ${error.stack} errorCode: ${error.errorCode}`);
            handleUnsuccessfulResponse(res, error, errMessage);
        }
    });

    return priceZoneReassignmentRouter;
 };
