/**
 * This Helper class contains CIPZ business util functions
 */
// Core
import {BAD_REQUEST, INTERNAL_SERVER_ERROR, OK} from 'http-status-codes';
// Utils
import {getCorrelationId} from '../util/correlationIdGenerator';
import {createErrorResponse} from '../mapper/responseMapper';
import logger from '../util/logger';
// Exceptions
import SeedApiDataFetchException from '../exception/seedApiDataFechException';
import InvalidRequestException from '../exception/invalidRequestException';
import CipzApiDataFetchException from '../exception/cipzApiDataFetchException';
// Constants, Validation schema, Exception codes and others
import {CORRELATION_ID_HEADER, INVALID_REQUEST_BODY} from '../util/constants';
import {CIPZ_SEED_VALIDATION_ERROR_CODES} from '../exception/exceptionCodes';
import {
    cipzApprovalRequestReqBody,
    priceZoneReassignmentCreateReqBody,
    priceZoneReassignmentSearchReqBody,
} from '../validator/schema';

const containsValidCustomerIdentifier = ({customerAccount, customerGroup}) => !!(customerAccount || customerGroup);

const containsValidPriceZone = ({newPriceZone}) => newPriceZone >= 1 && newPriceZone <= 5;

const generateHttpStatusCode = (error) => {
    if (error instanceof SeedApiDataFetchException
        || error instanceof InvalidRequestException
        || error instanceof CipzApiDataFetchException) {
        return BAD_REQUEST;
    }
    return INTERNAL_SERVER_ERROR;
};

export const isCustomerAccountDefined = ({customer_account: customerAccount}) => !!customerAccount;

export const validateCreatePriceZoneChangeRequest = ({body}) => {
    const {error} = priceZoneReassignmentCreateReqBody.validate(body);
    if (error || !containsValidCustomerIdentifier(body) || !containsValidPriceZone(body)) {
        logger.error(`Request body validation failed in pz update request data: ${JSON.stringify(body)} Error: ${error}`);
        throw new InvalidRequestException(
            INVALID_REQUEST_BODY,
            BAD_REQUEST,
            CIPZ_SEED_VALIDATION_ERROR_CODES.PRICE_ZONE_REASSIGNMENT_INVALID_UPDATE_PAYLOAD_ERROR_CODE,
        );
    }
};

export const validateSearchRequest = ({body}) => {
    const {error} = priceZoneReassignmentSearchReqBody.validate(body);
    if (error) {
        logger.error(`Request body validation failed in search request data: ${JSON.stringify(body)} Error: ${error}`);
        throw new InvalidRequestException(
            INVALID_REQUEST_BODY,
            BAD_REQUEST,
            CIPZ_SEED_VALIDATION_ERROR_CODES.PRICE_ZONE_REASSIGNMENT_INVALID_SEARCH_PAYLOAD_ERROR_CODE,
        );
    }
};

export const validateReviewPatchRequest = ({body}) => {
    const {error} = cipzApprovalRequestReqBody.validate(body);
    if (error) {
        logger.error(`Request body validation failed in getting CIPZ review update request data: ${JSON.stringify(body)} Error: ${error}`);
        throw new InvalidRequestException(
            INVALID_REQUEST_BODY,
            BAD_REQUEST,
            CIPZ_SEED_VALIDATION_ERROR_CODES.CPIZ_API_DATA_INVALID_PAYLOAD_ERROR_CODE,
        );
    }
};

export const handleSuccessResponse = (res, responseData) => {
    res.set(CORRELATION_ID_HEADER, getCorrelationId());
    res.status(OK)
        .send(responseData);
};

export const handleUnsuccessfulResponse = (res, error, errorMessage) => {
    const httpStatusCode = generateHttpStatusCode(error);
    res.set(CORRELATION_ID_HEADER, getCorrelationId());
    res.status(httpStatusCode)
        .send(createErrorResponse(null, errorMessage, error, null, error.errorCode));
};
