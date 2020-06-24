/**
 * Batch routes unit tests
 *
 * @author: gkar5861 on 22/06/20
 **/

import request from 'supertest';
import {app} from '../../../app';
import * as HttpStatus from "http-status-codes";
import {
    ERROR,
    ERROR_IN_GETTING_S3_OUTPUT_SIGNED_URL_INVALID_SOURCE,
    ERROR_IN_GETTING_S3_OUTPUT_SIGNED_URL_UNSUPPORTED_REQUEST_BODY,
    SUCCESS
} from "../../../util/constants";

jest.mock('../../../httpClient/httpClient');

const mockRequest = {
    "fileNames": [
        "fileName1",
        "fileName2"
    ]
}
const mockResponse = [
    {
        "fileName": "fileName1",
        "putUrl": "https://batch-output.s3.amazonaws.com/fileName1?AWSAccessKeyId=ASIAQRLXWZJ"
    },
    {
        "fileName": "fileName2",
        "putUrl": "https://batch-output.s3.amazonaws.com/fileName2?AWSAccessKeyId=ASIAQRLXWZJ"
    }
];

describe('routes: /batch', () => {

    test('post /batch/signed-url/{source} should return write signed-urls when the source is input', async () => {

        const response = await request(app)
            .post('/v1/pci-bff/batch/signed-url/input')
            .send(mockRequest)
            .set('Accept', 'application/json');
        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.body).toBeDefined();
        expect(response.body.status).toEqual(SUCCESS);
        expect(response.body.data).toEqual(mockResponse);
    });

    test('post /batch/signed-url/{source} should return read signed-urls when the source is output', async () => {

        const response = await request(app)
            .post('/v1/pci-bff/batch/signed-url/output')
            .send(mockRequest)
            .set('Accept', 'application/json');
        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.body).toBeDefined();
        expect(response.body.status).toEqual(SUCCESS);
        expect(response.body.data).toEqual(mockResponse);
    });

    test('post /batch/signed-url/{source} should throw exception when the source is invalid', async () => {

        const response = await request(app)
            .post('/v1/pci-bff/batch/signed-url/invalid')
            .send(mockRequest)
            .set('Accept', 'application/json');
        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
        expect(response.body.status).toEqual(ERROR);
        expect(response.body.cause).toEqual(ERROR_IN_GETTING_S3_OUTPUT_SIGNED_URL_INVALID_SOURCE);
    });

    test('post /batch/signed-url/{source} should throw exception when request body is invalid', async () => {
        const invalidRequestBody = {};
        const response = await request(app)
            .post('/v1/pci-bff/batch/signed-url/input')
            .send(invalidRequestBody)
            .set('Accept', 'application/json');
        expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
        expect(response.body.status).toEqual(ERROR);
        expect(response.body.cause).toEqual(ERROR_IN_GETTING_S3_OUTPUT_SIGNED_URL_UNSUPPORTED_REQUEST_BODY);
    });
});
