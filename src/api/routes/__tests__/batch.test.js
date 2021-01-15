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
    EMPTY_REQUEST_BODY,
    ERROR,
    ERROR_IN_DELETING_BATCH_JOBS,
    ERROR_IN_GETTING_BATCH_JOBS,
    INVALID_REQUEST_BODY,
    SUCCESS,
} from '../../../util/constants';
import {
    BATCH_API_DATA_FETCH_ERROR_CODE,
    EMPTY_REQUEST_BODY_CODE,
    INVALID_REQUEST_BODY_CODE,
} from '../../../exception/exceptionCodes';
import {
    mockErrorRequestSignedUrl,
    mockRequestDownloadSignedUrl,
    mockRequestUploadSignedUrl,
    mockResponseDeleteJob,
    mockResponseJobList,
    mockResponseSignedUrl,
} from '../../../config/test.config';

jest.mock('../../../middleware/authMiddleware');
const {authMiddleware} = require('../../../middleware/authMiddleware');

jest.mock('../../../httpClient/httpClient');

jest.mock('../../../initializer', () => ({
    initializer: (req, res, next) => next(),
}));

describe('routes: /batch', () => {
    test('post /batch/signed-url/input should return write signed-urls when the source is input', async () => {
        authMiddleware.mockImplementationOnce((req, res, next) => {
            res.locals.authResponse = {
                authenticated: true,
                cause: null,
                username: 'username',
                userDetailsData: {
                    authorizedPricingTransformationEnabledBunitList: ['019'],
                    authorizedBatchEnabledBunitList: ['001', '002'],
                    email: 'firstName.secondName@syscolabs.com',
                    firstName: 'firstName',
                    jobTitle: 'jobTitle',
                    lastName: 'secondName',
                    username: 'test1234',
                },
            };
            next();
        });
        const response = await request(app.app)
            .post('/v1/pci-bff/batch/signed-url/input')
            .send(mockRequestUploadSignedUrl)
            .set('Accept', 'application/json');
        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.headers[CORRELATION_ID_HEADER]);
        expect(response.body).toBeDefined();
        expect(response.body.status).toEqual(SUCCESS);
        expect(response.body.data).toEqual(mockResponseSignedUrl.data.data);
    });

    test('post /batch/signed-url/output should return read signed-urls when the source is output', async () => {
        authMiddleware.mockImplementationOnce((req, res, next) => {
            res.locals.authResponse = {
                authenticated: true,
                cause: null,
                username: 'username',
                userDetailsData: {
                    authorizedPricingTransformationEnabledBunitList: ['019'],
                    authorizedBatchEnabledBunitList: ['001', '002'],
                    email: 'firstName.secondName@syscolabs.com',
                    firstName: 'firstName',
                    jobTitle: 'jobTitle',
                    lastName: 'secondName',
                    username: 'test1234',
                },
            };
            next();
        });
        const response = await request(app.app)
            .post('/v1/pci-bff/batch/signed-url/output')
            .send(mockRequestDownloadSignedUrl)
            .set('Accept', 'application/json');
        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.headers[CORRELATION_ID_HEADER]);
        expect(response.body).toBeDefined();
        expect(response.body.status).toEqual(SUCCESS);
        expect(response.body.data).toEqual(mockResponseSignedUrl.data.data);
    });

    test('post /batch/signed-url/input should throw exception when client error', async () => {
        authMiddleware.mockImplementationOnce((req, res, next) => {
            res.locals.authResponse = {
                authenticated: true,
                cause: null,
                username: 'username',
                userDetailsData: {
                    authorizedPricingTransformationEnabledBunitList: ['019'],
                    authorizedBatchEnabledBunitList: ['001', '002'],
                    email: 'firstName.secondName@syscolabs.com',
                    firstName: 'firstName',
                    jobTitle: 'jobTitle',
                    lastName: 'secondName',
                    username: 'test1234',
                },
            };
            next();
        });
        const response = await request(app.app)
            .post('/v1/pci-bff/batch/signed-url/input')
            .send(mockErrorRequestSignedUrl)
            .set('Accept', 'application/json');
        expect(response.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(response.body.status).toEqual(ERROR);
        expect(response.body.errorCode).toEqual(BATCH_API_DATA_FETCH_ERROR_CODE);
    });

    test('post /batch/signed-url/output should throw exception when client error', async () => {
        authMiddleware.mockImplementationOnce((req, res, next) => {
            res.locals.authResponse = {
                authenticated: true,
                cause: null,
                username: 'username',
                userDetailsData: {
                    authorizedPricingTransformationEnabledBunitList: ['019'],
                    authorizedBatchEnabledBunitList: ['001', '002'],
                    email: 'firstName.secondName@syscolabs.com',
                    firstName: 'firstName',
                    jobTitle: 'jobTitle',
                    lastName: 'secondName',
                    username: 'test1234',
                },
            };
            next();
        });
        const response = await request(app.app)
            .post('/v1/pci-bff/batch/signed-url/output')
            .send(mockErrorRequestSignedUrl)
            .set('Accept', 'application/json');
        expect(response.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(response.body.status).toEqual(ERROR);
        expect(response.body.errorCode).toEqual(BATCH_API_DATA_FETCH_ERROR_CODE);
    });

    test('post /batch/signed-url/input should throw exception when request body is invalid', async () => {
        authMiddleware.mockImplementationOnce((req, res, next) => {
            res.locals.authResponse = {
                authenticated: true,
                cause: null,
                username: 'username',
                userDetailsData: {
                    authorizedPricingTransformationEnabledBunitList: ['019'],
                    authorizedBatchEnabledBunitList: ['001', '002'],
                    email: 'firstName.secondName@syscolabs.com',
                    firstName: 'firstName',
                    jobTitle: 'jobTitle',
                    lastName: 'secondName',
                    username: 'test1234',
                },
            };
            next();
        });
        const invalidRequestBody = {};
        const response = await request(app.app)
            .post('/v1/pci-bff/batch/signed-url/input')
            .send(invalidRequestBody)
            .set('Accept', 'application/json');
        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
        expect(response.headers[CORRELATION_ID_HEADER]);
        expect(response.body.status).toEqual(ERROR);
        expect(response.body.errorCode).toEqual(EMPTY_REQUEST_BODY_CODE);
        expect(response.body.cause).toEqual(EMPTY_REQUEST_BODY);
    });

    test('post /batch/signed-url/output should throw exception when request body is invalid', async () => {
        authMiddleware.mockImplementationOnce((req, res, next) => {
            res.locals.authResponse = {
                authenticated: true,
                cause: null,
                username: 'username',
                userDetailsData: {
                    authorizedPricingTransformationEnabledBunitList: ['019'],
                    authorizedBatchEnabledBunitList: ['001', '002'],
                    email: 'firstName.secondName@syscolabs.com',
                    firstName: 'firstName',
                    jobTitle: 'jobTitle',
                    lastName: 'secondName',
                    username: 'test1234',
                },
            };
            next();
        });
        const invalidRequestBody = {
            fileNames: '',
        };
        const response = await request(app.app)
            .post('/v1/pci-bff/batch/signed-url/output')
            .send(invalidRequestBody)
            .set('Accept', 'application/json');
        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
        expect(response.headers[CORRELATION_ID_HEADER]);
        expect(response.body.status).toEqual(ERROR);
        expect(response.body.errorCode).toEqual(INVALID_REQUEST_BODY_CODE);
        expect(response.body.cause).toEqual(INVALID_REQUEST_BODY);
    });

    test('get /batch/jobs should return batch job list when no errors', async () => {
        authMiddleware.mockImplementationOnce((req, res, next) => {
            res.locals.authResponse = {
                authenticated: true,
                cause: null,
                username: 'username',
                userDetailsData: {
                    authorizedPricingTransformationEnabledBunitList: ['019'],
                    authorizedBatchEnabledBunitList: ['001', '002'],
                    email: 'firstName.secondName@syscolabs.com',
                    firstName: 'firstName',
                    jobTitle: 'jobTitle',
                    lastName: 'secondName',
                    username: 'test1234',
                },
            };
            next();
        });
        const response = await request(app.app)
            .get('/v1/pci-bff/batch/jobs?pageSize=10&offSet=10')
            .set('Accept', 'application/json');
        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.body).toBeDefined();
        expect(response.body.status).toEqual(SUCCESS);
        expect(response.body.data).toEqual(mockResponseJobList.data.data);
    });

    test('get /batch/jobs should throw exception when the userId is invalid', async () => {
        authMiddleware.mockImplementationOnce((req, res, next) => {
            res.locals.authResponse = {
                authenticated: true,
                cause: null,
                username: 'username',
                userDetailsData: {
                    authorizedPricingTransformationEnabledBunitList: ['019'],
                    authorizedBatchEnabledBunitList: ['001', '002'],
                    email: 'firstName.secondName@syscolabs.com',
                    firstName: 'firstName',
                    jobTitle: 'jobTitle',
                    lastName: 'secondName',
                    username: 'test12345',
                },
            };
            next();
        });
        const response = await request(app.app)
            .get('/v1/pci-bff/batch/jobs')
            .set('Accept', 'application/json');
        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
        expect(response.headers[CORRELATION_ID_HEADER]);
        expect(response.body.status).toEqual(ERROR);
        expect(response.body.errorCode).toEqual(BATCH_API_DATA_FETCH_ERROR_CODE);
        expect(response.body.message).toEqual(ERROR_IN_GETTING_BATCH_JOBS);
    });

    test('get /batch/jobs should throw exception client error occurred', async () => {
        authMiddleware.mockImplementationOnce((req, res, next) => {
            res.locals.authResponse = {
                authenticated: true,
                cause: null,
                username: 'username',
                userDetailsData: {
                    authorizedPricingTransformationEnabledBunitList: ['019'],
                    authorizedBatchEnabledBunitList: ['001', '002'],
                    email: 'firstName.secondName@syscolabs.com',
                    firstName: 'firstName',
                    jobTitle: 'jobTitle',
                    lastName: 'secondName',
                    username: 'test1234',
                },
            };
            next();
        });
        const response = await request(app.app)
            .get('/v1/pci-bff/batch/jobs?pageSize')
            .set('Accept', 'application/json');
        expect(response.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(response.headers[CORRELATION_ID_HEADER]);
        expect(response.body.status).toEqual(ERROR);
        expect(response.body.errorCode).toEqual(BATCH_API_DATA_FETCH_ERROR_CODE);
    });

    test('delete /batch/jobs/{jobId} should delete file list when no errors', async () => {
        authMiddleware.mockImplementationOnce((req, res, next) => {
            res.locals.authResponse = {
                authenticated: true,
                cause: null,
                username: 'username',
                userDetailsData: {
                    authorizedPricingTransformationEnabledBunitList: ['019'],
                    authorizedBatchEnabledBunitList: ['001', '002'],
                    email: 'firstName.secondName@syscolabs.com',
                    firstName: 'firstName',
                    jobTitle: 'jobTitle',
                    lastName: 'secondName',
                    username: 'test1234',
                },
            };
            next();
        });
        const response = await request(app.app)
            .delete('/v1/pci-bff/batch/jobs/11112222')
            .send(mockRequestDownloadSignedUrl)
            .set('Accept', 'application/json');
        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.headers[CORRELATION_ID_HEADER]);
        expect(response.body).toBeDefined();
        expect(response.body.status).toEqual(SUCCESS);
        expect(response.body.data).toEqual(mockResponseDeleteJob.data.data);
    });

    test('delete /batch/jobs/{jobId} should throw exception when userId is invalid ', async () => {
        authMiddleware.mockImplementationOnce((req, res, next) => {
            res.locals.authResponse = {
                authenticated: true,
                cause: null,
                username: 'username',
                userDetailsData: {
                    authorizedPricingTransformationEnabledBunitList: ['019'],
                    authorizedBatchEnabledBunitList: ['001', '002'],
                    email: 'firstName.secondName@syscolabs.com',
                    firstName: 'firstName',
                    jobTitle: 'jobTitle',
                    lastName: 'secondName',
                    username: 'test12345',
                },
            };
            next();
        });
        const response = await request(app.app)
            .delete('/v1/pci-bff/batch/jobs/11112222')
            .set('Accept', 'application/json');
        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
        expect(response.headers[CORRELATION_ID_HEADER]);
        expect(response.body.status).toEqual(ERROR);
        expect(response.body.errorCode).toEqual(BATCH_API_DATA_FETCH_ERROR_CODE);
        expect(response.body.message).toEqual(ERROR_IN_DELETING_BATCH_JOBS);
    });

    test('delete /batch/jobs/{jobId} should throw exception when client error', async () => {
        authMiddleware.mockImplementationOnce((req, res, next) => {
            res.locals.authResponse = {
                authenticated: true,
                cause: null,
                username: 'username',
                userDetailsData: {
                    authorizedPricingTransformationEnabledBunitList: ['019'],
                    authorizedBatchEnabledBunitList: ['001', '002'],
                    email: 'firstName.secondName@syscolabs.com',
                    firstName: 'firstName',
                    jobTitle: 'jobTitle',
                    lastName: 'secondName',
                    username: 'test1234',
                },
            };
            next();
        });
        const response = await request(app.app)
            .delete('/v1/pci-bff/batch/jobs/0')
            .set('Accept', 'application/json');
        expect(response.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(response.headers[CORRELATION_ID_HEADER]);
        expect(response.body.status).toEqual(ERROR);
        expect(response.body.errorCode).toEqual(BATCH_API_DATA_FETCH_ERROR_CODE);
    });
});
