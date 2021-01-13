/**
 * Check whether the request body is empty or undefined
 *
 * @author: gkar5861 on 22/06/20
 * */
import * as HttpStatus from 'http-status-codes';
import {INVALID_FILENAMES, INVALID_USERID, UNSUPPORTED_REQUEST_BODY} from '../util/constants';
import logger from '../util/logger';
import InvalidRequestException from '../exception/invalidRequestException';
import {INVALID_FILENAMES_CODE, INVALID_REQUEST_BODY, INVALID_USERID_CODE} from "../exception/exceptionCodes";

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

export const isEmptyRequestBody = (requestBody) => {
    if (isEmpty(requestBody)) {
        logger.error(`Request body validation failed: ${requestBody}`);
        throw new InvalidRequestException(
            UNSUPPORTED_REQUEST_BODY,
            HttpStatus.BAD_REQUEST,
            INVALID_REQUEST_BODY
        );
    }
}

/**
 * Validate file names in the request
 * */
export const validateRequestFileNames = (fileNames) => {
    if (fileNames === undefined || !Array.isArray(fileNames) || fileNames.length === 0) {
        logger.error(`File names validation failed: ${fileNames}`);
        throw new InvalidRequestException(
            INVALID_FILENAMES,
            HttpStatus.BAD_REQUEST,
            INVALID_FILENAMES_CODE
        );
    }
}

/**
 * Validate userId in the request
 * */
export const validateUserId = (userId) => {
    if (userId === undefined || userId.length !== 8) {
        logger.error(`User Id validation failed: ${userId}`);
        throw new InvalidRequestException(
            INVALID_USERID,
            HttpStatus.BAD_REQUEST,
            INVALID_USERID_CODE
        );
    }
}

