/**
 * Check whether the request body is empty or undefined
 *
 * @author: gkar5861 on 22/06/20
 * */
import * as HttpStatus from 'http-status-codes';
import {
    FILE_SOURCE_INPUT,
    FILE_SOURCE_OUTPUT,
    INVALID_S3_BUCKET_SOURCE,
    UNSUPPORTED_REQUEST_BODY
} from '../util/constants';
import logger from '../util/logger';
import InvalidRequestException from '../exception/invalidRequestException';
import {INVALID_REQUEST_BODY, INVALID_S3_SOURCE} from "../exception/exceptionCodes";

const isEmpty = (obj) => Object.keys(obj).length === 0;

const isUndefinedFields = (obj) => Object.entries(obj)
    .some(([k, v]) => !k || !v || typeof v === 'undefined' || v === '' || isEmpty(v));

export const validateRequestBody = (requestBody) => {
    if (isEmpty(requestBody) || isUndefinedFields(requestBody)) {
        logger.error(`Request body validation failed: ${requestBody}`);
        throw new InvalidRequestException(
            UNSUPPORTED_REQUEST_BODY,
            HttpStatus.BAD_REQUEST,
            INVALID_REQUEST_BODY
        );
    }
}

export const validateSource = (source) => {
    if (!(source === FILE_SOURCE_INPUT || source === FILE_SOURCE_OUTPUT)) {
        logger.error(`S3 source validation failed: ${source}`);
        throw new InvalidRequestException(
            INVALID_S3_BUCKET_SOURCE,
            HttpStatus.BAD_REQUEST,
            INVALID_S3_SOURCE
        );
    }
}
