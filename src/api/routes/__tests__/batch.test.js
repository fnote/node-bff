/**
 * Batch routes unit tests
 *
 * @author: gkar5861 on 22/06/20
 * */

import request from 'supertest';
import * as HttpStatus from 'http-status-codes';
import {jest} from '@jest/globals';
import app from '../../../app';
import {ERROR, INVALID_S3_BUCKET_SOURCE, SUCCESS, UNSUPPORTED_REQUEST_BODY,} from '../../../util/constants';

jest.mock('../../../httpClient/httpClient');

jest.mock('../../../middleware/authMiddleware', () => ({
    authMiddleware: (req, res, next) => next(),
}));
jest.mock('../../../initializer', () => ({
    initializer: (req, res, next) => next(),
}));

jest.mock('../../../initializer', () => ({
    initializer: (req, res, next) => next(),
}));

const mockRequest = {
    fileNames: [
        'fileName1',
        'fileName2',
    ],
};
const mockResponse = [
    {
        fileName: 'fileName1',
        putUrl: 'https://batch-output.s3.amazonaws.com/fileName1?AWSAccessKeyId=ASIAQRLXWZJ',
    },
    {
        fileName: 'fileName2',
        putUrl: 'https://batch-output.s3.amazonaws.com/fileName2?AWSAccessKeyId=ASIAQRLXWZJ',
    },
];

describe('routes: /batch', () => {
    test('post /batch/signed-url/{source} should return write signed-urls when the source is input', async () => {
        const response = await request(app.app)
            .post('/v1/pci-bff/batch/signed-url/input')
            .send(mockRequest)
            .set('Accept', 'application/json');
        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.body).toBeDefined();
        expect(response.body.status).toEqual(SUCCESS);
        expect(response.body.data).toEqual(mockResponse);
    });

    test('post /batch/signed-url/{source} should return read signed-urls when the source is output', async () => {
        const response = await request(app.app)
            .post('/v1/pci-bff/batch/signed-url/output')
            .send(mockRequest)
            .set('Accept', 'application/json');
        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.body).toBeDefined();
        expect(response.body.status).toEqual(SUCCESS);
        expect(response.body.data).toEqual(mockResponse);
    });

    test('post /batch/signed-url/{source} should throw exception when the source is invalid', async () => {
        const response = await request(app.app)
            .post('/v1/pci-bff/batch/signed-url/invalid')
            .send(mockRequest)
            .set('Accept', 'application/json');
        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
        expect(response.body.status).toEqual(ERROR);
        expect(response.body.cause).toEqual(INVALID_S3_BUCKET_SOURCE);
    });

    test('post /batch/signed-url/{source} should throw exception when request body is invalid', async () => {
        const invalidRequestBody = {};
        const response = await request(app.app)
            .post('/v1/pci-bff/batch/signed-url/input')
            .send(invalidRequestBody)
            .set('Accept', 'application/json');
        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
        expect(response.body.status).toEqual(ERROR);
        expect(response.body.cause)
            .toEqual(UNSUPPORTED_REQUEST_BODY);
    });
});
