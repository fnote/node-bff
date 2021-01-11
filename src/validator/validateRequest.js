/**
 * Check whether the request body is empty or undefined
 *
 * @author: gkar5861 on 22/06/20
 * */
import * as HttpStatus from 'http-status-codes';
import {
    FILE_SOURCE_INPUT,
    FILE_SOURCE_OUTPUT,
    INVALID_CONTENT_TYPE,
    INVALID_FILENAMES,
    INVALID_S3_BUCKET_SOURCE,
    INVALID_USERID,
    UNSUPPORTED_REQUEST_BODY
} from '../util/constants';
import logger from '../util/logger';
import InvalidRequestException from '../exception/invalidRequestException';
import {
    INVALID_CONTENT_TYPE_CODE,
    INVALID_FILENAMES_CODE,
    INVALID_REQUEST_BODY,
    INVALID_S3_SOURCE,
    INVALID_USERID_CODE
} from "../exception/exceptionCodes";

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
 * Validate file content type
 * */
export const validateRequestContentType = (contentType) => {
    const acceptableTypes = ['', 'text/plain', 'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    if (contentType === undefined || !acceptableTypes.includes(contentType)) {
        logger.error(`Content type validation failed: ${contentType}`);
        throw new InvalidRequestException(
            INVALID_CONTENT_TYPE,
            HttpStatus.BAD_REQUEST,
            INVALID_CONTENT_TYPE_CODE
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
