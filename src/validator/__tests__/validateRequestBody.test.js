/**
 * Request Body Validator unit tests
 *
 * @author: gkar5861 on 23/06/20
 * */

import * as HttpStatus from 'http-status-codes';
import {isEmptyRequestBody, validateRequestBody} from '../validateRequest';
import InvalidRequestException from '../../exception/invalidRequestException';
import {EMPTY_REQUEST_BODY, INVALID_REQUEST_BODY} from '../../util/constants';
import {describe, test} from "@jest/globals";
import {EMPTY_REQUEST_BODY_CODE, INVALID_REQUEST_BODY_CODE} from "../../exception/exceptionCodes";

const validRequestBody = {
    fileNames: [
        'fileName1',
        'fileName2',
    ],
    contentType: 'text/plain',
    userId: 'test1234',
    authorizedBunitList: ['001', '002']
};

const emptyRequestBody = {};

const inValidRequestBody1 = {
    fileNames: '',
    contentType: 'text/plain',
    userId: 'test1234',
    authorizedBunitList: ['001', '002']
};

const inValidRequestBody2 = {
    '': [
        'fileName1',
        'fileName2',
    ], contentType: 'text/plain',
    userId: 'test1234',
    authorizedBunitList: ['001', '002']
};


describe('Request Body Validator', () => {
    test('should return nothing when the request body is valid', async () => {
        expect(() => validateRequestBody(validRequestBody)).not
            .toThrowError(new InvalidRequestException(
                INVALID_REQUEST_BODY,
                HttpStatus.BAD_REQUEST,
            ));
    });

    test('should throw InvalidRequestException when the request body is empty', async () => {
        expect(() => validateRequestBody(inValidRequestBody1))
            .toThrowError(new InvalidRequestException(
                INVALID_REQUEST_BODY,
                HttpStatus.BAD_REQUEST,
                INVALID_REQUEST_BODY_CODE
            ));
    });

    test('should throw InvalidRequestException when the request body is empty', async () => {
        expect(() => validateRequestBody(inValidRequestBody2))
            .toThrowError(new InvalidRequestException(
                INVALID_REQUEST_BODY,
                HttpStatus.BAD_REQUEST,
                INVALID_REQUEST_BODY_CODE
            ));
    });

    test('should throw InvalidRequestException when the request body is empty', async () => {
        expect(() => validateRequestBody(emptyRequestBody))
            .toThrowError(new InvalidRequestException(
                EMPTY_REQUEST_BODY,
                HttpStatus.BAD_REQUEST,
                EMPTY_REQUEST_BODY_CODE
            ));
    });

    test('should throw InvalidRequestException when the request body is empty', async () => {
        expect(() => isEmptyRequestBody(emptyRequestBody))
            .toThrowError(new InvalidRequestException(
                EMPTY_REQUEST_BODY,
                HttpStatus.BAD_REQUEST,
                EMPTY_REQUEST_BODY_CODE
            ));
    });

});
