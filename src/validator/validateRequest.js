/**
 * Check whether the request body is empty or undefined
 *
 * @author: gkar5861 on 22/06/20
 * */
import * as HttpStatus from 'http-status-codes';
import {EMPTY_REQUEST_BODY, INVALID_REQUEST_BODY} from '../util/constants';
import logger from '../util/logger';
import InvalidRequestException from '../exception/invalidRequestException';
import {EMPTY_REQUEST_BODY_CODE, INVALID_REQUEST_BODY_CODE,} from "../exception/exceptionCodes";

const isEmpty = (obj) => Object.keys(obj).length === 0;

const isUndefinedFields = (obj) => Object.entries(obj)
    .some(([k, v]) => !k || !v || typeof v === 'undefined' || v === '' || isEmpty(v));


export const isEmptyRequestBody = (requestBody) => {
    if (isEmpty(requestBody)) {
        logger.error(`Request body validation failed: ${requestBody}`);
        throw new InvalidRequestException(
            EMPTY_REQUEST_BODY,
            HttpStatus.BAD_REQUEST,
            EMPTY_REQUEST_BODY_CODE
        );
    }
}

export const validateRequestBody = (requestBody) => {
    isEmptyRequestBody(requestBody)
    if (isUndefinedFields(requestBody)) {
        logger.error(`Request body validation failed: ${requestBody}`);
        throw new InvalidRequestException(
            INVALID_REQUEST_BODY,
            HttpStatus.BAD_REQUEST,
            INVALID_REQUEST_BODY_CODE
        );
    }
}


