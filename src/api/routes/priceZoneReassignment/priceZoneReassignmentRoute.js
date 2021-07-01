import {Router} from 'express';
import * as HttpStatus from 'http-status-codes';
import logger from '../../../util/logger';
import {createErrorResponse} from '../../../mapper/responseMapper';
import seedService from '../../../service/seed/seedService';
import PriceZoneReassignmentService from '../../../service/priceZoneReassignment/priceZoneReassignmentService';
import {
    CORRELATION_ID_HEADER,
    INVALID_REQUEST_BODY,
    ERROR_IN_CREATING_CIPZ_PRICE_ZONE_UPDATE,
    ERROR_IN_HANDLING_SEARCH_RESULTS,
    ERROR_IN_GETTING_CIPZ_PRICE_ZONE_SUBMITTED_REQ_DATA,
    ERROR_IN_FETCHING_SEED_ITEM_ATTRIBUTE_GROUP_DATA,
    ERROR_IN_HANDLING_CIPZ_PRICE_ZONE_UPDATE,
    ERROR_IN_RESPONSING_CIPZ_PRICE_ZONE_APPROVAL_REQ,
    ITEM_ATTRIBUTE_GROUPS,
    PZ_UPDATE_REQUESTS,
    PZ_UPDATES,
    PZ_SEARCH,
    GENERIC_CIPZ_API_ERROR_MESSAGE,
} from '../../../util/constants';
import {getCorrelationId} from '../../../util/correlationIdGenerator';
import SeedApiDataFetchException from '../../../exception/seedApiDataFechException';
import InvalidRequestException from '../../../exception/invalidRequestException';
import {CIPZ_SEED_VALIDATION_AND_GENERAL_ERROR_CODES} from '../../../exception/exceptionCodes';
import {
    priceZoneReassignmentSearchReqBody,
    priceZoneReassignmentCreateReqBody,
    cipzApprovalRequestReqBody,
} from '../../../validator/schema';
import CipzApiDataFetchException from '../../../exception/cipzApiDataFetchException';

export default () => {
    const priceZoneReassignmentRouter = new Router();

    const handleSuccessResponse = (res, responseData) => {
        res.set(CORRELATION_ID_HEADER, getCorrelationId());
        res.status(HttpStatus.OK)
            .send(responseData);
    };

    const generateHttpStatusCode = (error) => {
        if (error instanceof SeedApiDataFetchException
            || error instanceof InvalidRequestException
            || error instanceof CipzApiDataFetchException) {
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

    const containsValidCustomerIdentifier = ({customerAccount, customerGroup}) => !!(customerAccount || customerGroup);

    const containsValidPriceZone = ({newPriceZone}) => newPriceZone >= 1 && newPriceZone <= 5;

    const validateCreatePriceZoneChangeRequest = ({body}) => {
        const {error} = priceZoneReassignmentCreateReqBody.validate(body);
        if (error || !containsValidCustomerIdentifier(body) || !containsValidPriceZone(body)) {
            throw new InvalidRequestException(
                INVALID_REQUEST_BODY,
                HttpStatus.BAD_REQUEST,
                CIPZ_SEED_VALIDATION_AND_GENERAL_ERROR_CODES.PRICE_ZONE_REASSIGNMENT_INVALID_UPDATE_PAYLOAD_ERROR_CODE,
            );
        }
    };

    const isCustomerAccountDefined = ({customer_account: customerAccount}) => !!customerAccount;

    const validateSearchRequest = ({body}) => {
        const {error} = priceZoneReassignmentSearchReqBody.validate(body);
        if (error) {
            throw new InvalidRequestException(
                INVALID_REQUEST_BODY,
                HttpStatus.BAD_REQUEST,
                CIPZ_SEED_VALIDATION_AND_GENERAL_ERROR_CODES.PRICE_ZONE_REASSIGNMENT_INVALID_SEARCH_PAYLOAD_ERROR_CODE,
            );
        }
    };

    // SEED API Endpoints

    priceZoneReassignmentRouter.get(ITEM_ATTRIBUTE_GROUPS, async (req, res) => {
        try {
            const responseData = await seedService.getSeedItemAttributeGroupsData();
            logger.info(`Success Seed Data response received: ${JSON.stringify(responseData.data)}`);
            handleSuccessResponse(res, responseData.data);
        } catch (error) {
            const errMessage = error.errorDetails && error.errorDetails.message ? error.errorDetails.message
                : ERROR_IN_FETCHING_SEED_ITEM_ATTRIBUTE_GROUP_DATA;
            logger.error(`${errMessage}: ${error} cause: ${error.stack} errorCode: ${error.errorCode}`);
            handleUnsuccessfulResponse(res, error, errMessage);
        }
    });

    priceZoneReassignmentRouter.post(PZ_SEARCH, async (req, res) => {
        try {
            validateSearchRequest(req);
            let responseData;
            if (isCustomerAccountDefined(req.body)) {
                responseData = await seedService.getPriceZoneDetailsForCustomerAndItemAttributeGroup(req);
            } else {
                responseData = await seedService.getPriceZoneDetailsForCustomerGroupAndItemAttributeGroup(req);
            }
            logger.info(`Success Seed Data response received for search: ${JSON.stringify(responseData.data)}`);
            handleSuccessResponse(res, responseData.data);
        } catch (error) {
            const errMessage = error.errorDetails && error.errorDetails.message ? error.errorDetails.message : ERROR_IN_HANDLING_SEARCH_RESULTS;
            logger.error(`${errMessage}: ${error} cause: ${error.stack} errorCode: ${error.errorCode}`);
            handleUnsuccessfulResponse(res, error, errMessage);
        }
    });

    // CIPZ API Endpoints

    priceZoneReassignmentRouter.get(PZ_UPDATE_REQUESTS, async (req, res) => {
        try {
            const responseData = await PriceZoneReassignmentService.getCIPZSubmittedRequestData(req.query);
            logger.info(`Success CIPZ submitted requets Data response received: ${JSON.stringify(responseData)}`);
            handleSuccessResponse(res, responseData);
        } catch (error) {
            const errorMsg = ERROR_IN_GETTING_CIPZ_PRICE_ZONE_SUBMITTED_REQ_DATA;
            logger.error(`${errorMsg} : ${error} cause : ${error.stack} errorCode : ${error.errorCode}`);
            handleUnsuccessfulResponse(res, error, errorMsg);
        }
    });

    priceZoneReassignmentRouter.post(PZ_UPDATE_REQUESTS, async (req, res) => {
        try {
            validateCreatePriceZoneChangeRequest(req);
            console.log(req.body);
            const responseData = await PriceZoneReassignmentService.createPriceZoneChange(req);
            logger.info(`Success CIPZ create price zone update response received: ${JSON.stringify(responseData)}`);
            res.set(CORRELATION_ID_HEADER, getCorrelationId());
            res.status(HttpStatus.CREATED).send(responseData);
        } catch (error) {
            const errMessage = error.errorDetails && error.errorDetails.message ? error.errorDetails.message
                : ERROR_IN_CREATING_CIPZ_PRICE_ZONE_UPDATE;
            logger.error(`${errMessage} : ${error} cause : ${error.stack} errorCode : ${error.errorCode}`);
            handleUnsuccessfulResponse(res, error, errMessage);
        }
    });

    priceZoneReassignmentRouter.get(PZ_UPDATES, async (req, res) => {
        try {
            const requestId = req.params.request_id;
            const responseData = await PriceZoneReassignmentService.getPriceZoneUpdatesData(req.query, requestId);
            logger.info(`Success CIPZ API Price Zone Updates Data response received: ${JSON.stringify(responseData)}`);
            handleSuccessResponse(res, responseData);
        } catch (error) {
            const errorMsg = ERROR_IN_HANDLING_CIPZ_PRICE_ZONE_UPDATE;
            logger.error(`${errorMsg} : ${error} cause : ${error.stack} errorCode : ${error.errorCode}`);
            handleUnsuccessfulResponse(res, error, errorMsg);
        }
    });

    priceZoneReassignmentRouter.patch(PZ_UPDATE_REQUESTS, async (req, res) => {
        const {error} = cipzApprovalRequestReqBody.validate(req.body);
        if (error) {
            logger.error(`Request body validation failed in getting CIPZ Approval update request data: ${JSON.stringify(req.body)}`);
            throw new InvalidRequestException(INVALID_REQUEST_BODY, HttpStatus.BAD_REQUEST,
                CIPZ_SEED_VALIDATION_AND_GENERAL_ERROR_CODES.CPIZ_API_DATA_INVALID_PAYLOAD_ERROR_CODE);
        }
        try {
            const responseData = await PriceZoneReassignmentService.reviewSubmission(req.body);
            logger.info(` Successfully responsed CIPZ API approval request: ${JSON.stringify(responseData)}`);
            handleSuccessResponse(res, responseData);
        } catch (e) {
            const errorMsg = ERROR_IN_RESPONSING_CIPZ_PRICE_ZONE_APPROVAL_REQ;
            logger.error(`${errorMsg} : ${e} cause : ${e.stack} errorCode : ${e.errorCode}`);
            handleUnsuccessfulResponse(res, e, errorMsg);
        }
    });

    return priceZoneReassignmentRouter;
};
