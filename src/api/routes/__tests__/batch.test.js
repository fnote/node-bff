/**
 * Batch routes unit tests
 *
 * @author: gkar5861 on 22/06/20
 * */

import request from 'supertest';
import * as HttpStatus from 'http-status-codes';
import {jest} from '@jest/globals';
import app from '../../../app';
import {
    CORRELATION_ID_HEADER,
    ERROR,
    INVALID_S3_BUCKET_SOURCE,
    SUCCESS,
    UNSUPPORTED_REQUEST_BODY,
} from '../../../util/constants';
import {
    BATCH_API_DATA_FETCH_ERROR_CODE,
    INVALID_REQUEST_BODY,
    INVALID_S3_SOURCE
} from "../../../exception/exceptionCodes";
import {
    mockErrorRequestSignedUrl,
    mockRequestSignedUrl,
    mockResponseFileList,
    mockResponseSignedUrl
} from "../../../config/test.config";

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

describe('routes: /batch', () => {
    test('post /batch/signed-url/{source} should return write signed-urls when the source is input', async () => {
        const response = await request(app.app)
            .post('/v1/pci-bff/batch/signed-url/input')
            .send(mockRequestSignedUrl)
            .set('Accept', 'application/json');
        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.headers[CORRELATION_ID_HEADER]);
        expect(response.body).toBeDefined();
        expect(response.body.status).toEqual(SUCCESS);
        expect(response.body.data).toEqual(mockResponseSignedUrl.data.data);
    });

    test('post /batch/signed-url/{source} should return read signed-urls when the source is output', async () => {
        const response = await request(app.app)
            .post('/v1/pci-bff/batch/signed-url/output')
            .send(mockRequestSignedUrl)
            .set('Accept', 'application/json');
        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.headers[CORRELATION_ID_HEADER]);
        expect(response.body).toBeDefined();
        expect(response.body.status).toEqual(SUCCESS);
        expect(response.body.data).toEqual(mockResponseSignedUrl.data.data);
    });

    test('post /batch/signed-url/{source} should throw exception when client error', async () => {
        const response = await request(app.app)
            .post('/v1/pci-bff/batch/signed-url/input')
            .send(mockErrorRequestSignedUrl)
            .set('Accept', 'application/json');
        expect(response.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(response.body.status).toEqual(ERROR);
        expect(response.body.errorCode).toEqual(BATCH_API_DATA_FETCH_ERROR_CODE);
    });

    test('post /batch/signed-url/{source} should throw exception when the source is invalid', async () => {
        const response = await request(app.app)
            .post('/v1/pci-bff/batch/signed-url/invalid')
            .send(mockRequestSignedUrl)
            .set('Accept', 'application/json');
        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
        expect(response.headers[CORRELATION_ID_HEADER]);
        expect(response.body.status).toEqual(ERROR);
        expect(response.body.errorCode).toEqual(INVALID_S3_SOURCE);
        expect(response.body.cause).toEqual(INVALID_S3_BUCKET_SOURCE);
    });

    test('post /batch/signed-url/{source} should throw exception when request body is invalid', async () => {
        const invalidRequestBody = {};
        const response = await request(app.app)
            .post('/v1/pci-bff/batch/signed-url/input')
            .send(invalidRequestBody)
            .set('Accept', 'application/json');
        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
        expect(response.headers[CORRELATION_ID_HEADER]);
        expect(response.body.status).toEqual(ERROR);
        expect(response.body.errorCode).toEqual(INVALID_REQUEST_BODY);
        expect(response.body.cause)
            .toEqual(UNSUPPORTED_REQUEST_BODY);
    });

    test('get /batch/files/{source} should return file list when no errors', async () => {
        const response = await request(app.app)
            .get('/v1/pci-bff/batch/files/output')
            .set('Accept', 'application/json');
        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.body).toBeDefined();
        expect(response.body.status).toEqual(SUCCESS);
        expect(response.body.data).toEqual(mockResponseFileList.data.data);
    });

    test('get /batch/files/{source} should throw exception when the source is invalid', async () => {
        const response = await request(app.app)
            .get('/v1/pci-bff/batch/files/invalid')
            .set('Accept', 'application/json');
        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
        expect(response.headers[CORRELATION_ID_HEADER]);
        expect(response.body.status).toEqual(ERROR);
        expect(response.body.errorCode).toEqual(INVALID_S3_SOURCE);
        expect(response.body.cause).toEqual(INVALID_S3_BUCKET_SOURCE);
    });

    test('get /batch/files/{source}/{prefix} should return file list with given prefix', async () => {
        const response = await request(app.app)
            .get('/v1/pci-bff/batch/files/output/REV')
            .set('Accept', 'application/json');
        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.headers[CORRELATION_ID_HEADER]);
        expect(response.body).toBeDefined();
        expect(response.body.status).toEqual(SUCCESS);
        expect(response.body.data).toEqual(mockResponseFileList.data.data);
    });

    test('get /batch/files/{source}/{prefix} should throw exception when the source is invalid', async () => {
        const response = await request(app.app)
            .get('/v1/pci-bff/batch/files/invalid/REV')
            .set('Accept', 'application/json');
        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
        expect(response.headers[CORRELATION_ID_HEADER]);
        expect(response.body.status).toEqual(ERROR);
        expect(response.body.errorCode).toEqual(INVALID_S3_SOURCE);
        expect(response.body.cause).toEqual(INVALID_S3_BUCKET_SOURCE);
    });

    test('get /batch/signed-url/{source} should throw exception when client error', async () => {
        const response = await request(app.app)
            .get('/v1/pci-bff/batch/files/output/ERR')
            .set('Accept', 'application/json');
        expect(response.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(response.headers[CORRELATION_ID_HEADER]);
        expect(response.body.status).toEqual(ERROR);
        expect(response.body.errorCode).toEqual(BATCH_API_DATA_FETCH_ERROR_CODE);
    });

    test('delete /batch/files/{source} should delete file list when no errors', async () => {
        const response = await request(app.app)
            .delete('/v1/pci-bff/batch/files/output')
            .send(mockRequestSignedUrl)
            .set('Accept', 'application/json');
        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.headers[CORRELATION_ID_HEADER]);
        expect(response.body).toBeDefined();
        expect(response.body.status).toEqual(SUCCESS);
        expect(response.body.data).toEqual(mockResponseSignedUrl.data.data);
    });

    test('delete /batch/signed-url/{source} should throw exception when client error', async () => {
        const response = await request(app.app)
            .delete('/v1/pci-bff/batch/files/output')
            .send(mockErrorRequestSignedUrl)
            .set('Accept', 'application/json');
        expect(response.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(response.headers[CORRELATION_ID_HEADER]);
        expect(response.body.status).toEqual(ERROR);
        expect(response.body.errorCode).toEqual(BATCH_API_DATA_FETCH_ERROR_CODE);
    });

    test('delete /batch/files/{source} should throw exception when the source is invalid', async () => {
        const response = await request(app.app)
            .delete('/v1/pci-bff/batch/files/invalid')
            .send(mockRequestSignedUrl)
            .set('Accept', 'application/json');
        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
        expect(response.headers[CORRELATION_ID_HEADER]);
        expect(response.body.status).toEqual(ERROR);
        expect(response.body.errorCode).toEqual(INVALID_S3_SOURCE);
        expect(response.body.cause).toEqual(INVALID_S3_BUCKET_SOURCE);
    });

    test('delete /batch/files/{source} should throw exception when request body is invalid', async () => {
        const invalidRequestBody = {};
        const response = await request(app.app)
            .delete('/v1/pci-bff/batch/files/input')
            .send(invalidRequestBody)
            .set('Accept', 'application/json');
        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
        expect(response.headers[CORRELATION_ID_HEADER]);
        expect(response.body.status).toEqual(ERROR);
        expect(response.body.errorCode).toEqual(INVALID_REQUEST_BODY);
        expect(response.body.cause)
            .toEqual(UNSUPPORTED_REQUEST_BODY);
    });
});
