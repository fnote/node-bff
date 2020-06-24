/**
 * Check whether the request body is empty or undefined
 *
 * @author: gkar5861 on 22/06/20
 **/
import {ERROR_IN_GETTING_S3_OUTPUT_SIGNED_URL_UNSUPPORTED_REQUEST_BODY} from "../util/constants";
import logger from '../util/logger';
import InvalidRequestException from "../exception/invalidRequestException";
import * as HttpStatus from "http-status-codes";

export default function validateRequestBody(requestBody) {
    if (isEmpty(requestBody) || isUndefinedFields(requestBody)) {
        logger.error(`Request body validation failed: ${requestBody}`);
        throw new InvalidRequestException(ERROR_IN_GETTING_S3_OUTPUT_SIGNED_URL_UNSUPPORTED_REQUEST_BODY, HttpStatus.BAD_REQUEST);
    }
}

const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
}

const isUndefinedFields = (obj) => {
    return Object.entries(obj).some(([k, v], i) => !v || typeof v === 'undefined' || v === '')
}
