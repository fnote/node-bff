/**
 * Request Body Validator unit tests
 *
 * @author: gkar5861 on 23/06/20
 * */

import * as HttpStatus from 'http-status-codes';
import {validateRequestBody, validateSource} from '../validateRequest';
import InvalidRequestException from '../../exception/invalidRequestException';
import {
    FILE_SOURCE_INPUT,
    FILE_SOURCE_OUTPUT,
    INVALID_S3_BUCKET_SOURCE,
    UNSUPPORTED_REQUEST_BODY
} from '../../util/constants';
import {describe, test} from "@jest/globals";

const validRequestBody = {
    fileNames: [
        'fileName1',
        'fileName2',
    ],
};

const inValidRequestBody1 = {
    fileNames: '',
};

const inValidRequestBody2 = {};

describe('Request Body Validator', () => {
    test('should return nothing when the request body is valid', async () => {
        expect(() => validateRequestBody(validRequestBody)).not
            .toThrowError(new InvalidRequestException(
                UNSUPPORTED_REQUEST_BODY,
                HttpStatus.BAD_REQUEST,
            ));
    });

    test('should throw InvalidRequestException when the request body is inValid', async () => {
        expect(() => validateRequestBody(inValidRequestBody1))
            .toThrowError(new InvalidRequestException(
                UNSUPPORTED_REQUEST_BODY,
                HttpStatus.BAD_REQUEST,
            ));
    });

    test('should throw InvalidRequestException when the request body is empty', async () => {
        expect(() => validateRequestBody(inValidRequestBody2))
            .toThrowError(new InvalidRequestException(
                UNSUPPORTED_REQUEST_BODY,
                HttpStatus.BAD_REQUEST,
            ));
    });

    test('should not throw InvalidRequestException when the given source is input', async () => {
        expect(() => validateSource(FILE_SOURCE_INPUT)).not
            .toThrowError(new InvalidRequestException(
                INVALID_S3_BUCKET_SOURCE,
                HttpStatus.BAD_REQUEST,
            ));
    });

    test('should not throw InvalidRequestException when the given source is output', async () => {
        expect(() => validateSource(FILE_SOURCE_OUTPUT)).not
            .toThrowError(new InvalidRequestException(
                INVALID_S3_BUCKET_SOURCE,
                HttpStatus.BAD_REQUEST,
            ));
    });

    test('should throw InvalidRequestException when the given source is not input/output', async () => {
        expect(() => validateSource("error"))
            .toThrowError(new InvalidRequestException(
                INVALID_S3_BUCKET_SOURCE,
                HttpStatus.BAD_REQUEST,
            ));
    });
});
