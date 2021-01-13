/**
 * Request Body Validator unit tests
 *
 * @author: gkar5861 on 23/06/20
 * */

import * as HttpStatus from 'http-status-codes';
import {validateRequestBody, validateRequestFileNames, validateUserId} from '../validateRequest';
import InvalidRequestException from '../../exception/invalidRequestException';
import {INVALID_FILENAMES, INVALID_USERID, UNSUPPORTED_REQUEST_BODY} from '../../util/constants';
import {describe, test} from "@jest/globals";
import {INVALID_FILENAMES_CODE, INVALID_REQUEST_BODY, INVALID_USERID_CODE} from "../../exception/exceptionCodes";

const validRequestBody = {
    fileNames: [
        'fileName1',
        'fileName2',
    ],
    contentType: 'text/plain',
    userId: 'test1234',
    authorizedBunitList: ['001', '002']
};

const inValidRequestBody = {};

const inValidFileNamesRequestBody1 = {
    fileNames: '',
    contentType: 'text/plain',
    userId: 'test1234',
    authorizedBunitList: ['001', '002']
};

const inValidFileNamesRequestBody2 = {
    fileNames: [],
    contentType: 'text/plain',
    userId: 'test1234',
    authorizedBunitList: ['001', '002']
};
const inValidFileNamesRequestBody3 = {
    fileNames: {},
    contentType: 'text/plain',
    userId: 'test1234',
    authorizedBunitList: ['001', '002']
};

const inValidContentTypeRequestBody = {
    fileNames: [
        'fileName1',
        'fileName2',
    ],
    contentType: 'image/png',
    userId: 'test1234',
    authorizedBunitList: ['001', '002']
};

const inValidUserIdRequestBody1 = {
    fileNames: [
        'fileName1',
        'fileName2',
    ],
    contentType: 'text/plain',
    userId: null,
    authorizedBunitList: ['001', '002']
};

const inValidUserIdRequestBody2 = {
    fileNames: [
        'fileName1',
        'fileName2',
    ],
    contentType: 'text/plain',
    userId: 'test12345',
    authorizedBunitList: ['001', '002']
};

describe('Request Body Validator', () => {
    test('should return nothing when the request body is valid', async () => {
        expect(() => validateRequestBody(validRequestBody)).not
            .toThrowError(new InvalidRequestException(
                UNSUPPORTED_REQUEST_BODY,
                HttpStatus.BAD_REQUEST,
            ));
    });

    test('should throw InvalidRequestException when the request body is empty', async () => {
        expect(() => validateRequestBody(inValidRequestBody))
            .toThrowError(new InvalidRequestException(
                UNSUPPORTED_REQUEST_BODY,
                HttpStatus.BAD_REQUEST,
                INVALID_REQUEST_BODY
            ));
    });

    test('should throw InvalidRequestException when the filenames is string', async () => {
        expect(() => validateRequestFileNames(inValidFileNamesRequestBody1))
            .toThrowError(new InvalidRequestException(
                INVALID_FILENAMES,
                HttpStatus.BAD_REQUEST,
                INVALID_FILENAMES_CODE
            ));
    });

    test('should throw InvalidRequestException when the filenames is empty', async () => {
        expect(() => validateRequestFileNames(inValidFileNamesRequestBody2))
            .toThrowError(new InvalidRequestException(
                INVALID_FILENAMES,
                HttpStatus.BAD_REQUEST,
                INVALID_FILENAMES_CODE
            ));
    });

    test('should throw InvalidRequestException when the filenames is json', async () => {
        expect(() => validateRequestFileNames(inValidFileNamesRequestBody3))
            .toThrowError(new InvalidRequestException(
                INVALID_FILENAMES,
                HttpStatus.BAD_REQUEST,
                INVALID_FILENAMES_CODE
            ));
    });

    test('should throw InvalidRequestException when the userId is null', async () => {
        expect(() => validateUserId(inValidUserIdRequestBody1))
            .toThrowError(new InvalidRequestException(
                INVALID_USERID,
                HttpStatus.BAD_REQUEST,
                INVALID_USERID_CODE
            ));
    });

    test('should throw InvalidRequestException when the userId is invalid', async () => {
        expect(() => validateUserId(inValidUserIdRequestBody2))
            .toThrowError(new InvalidRequestException(
                INVALID_USERID,
                HttpStatus.BAD_REQUEST,
                INVALID_USERID_CODE
            ));
    });
});
