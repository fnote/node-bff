/**
 * Pricing data routes unit tests
 *
 * @author: adis0892 on 28/07/20
 * */

import request from 'supertest';
import * as HttpStatus from 'http-status-codes';
import {jest} from '@jest/globals';
import app from '../../../app';
import {
    pricingDataMockRequest,
    cloudPricingErrorMockRequest,
    aggregatedPricingMockResponst,
    pricingDataMockResponseThrowErrorForCloudPricingCall,
} from '../../../config/test.config';
import { ERROR_IN_GETTING_S3_OUTPUT_SIGNED_URL_UNSUPPORTED_REQUEST_BODY } from '../../../util/constants';
import { PRICING_DATA_INVALID_PAYLOAD_ERROR_CODE } from '../../../exception/exceptionCodes';

jest.mock('../../../httpClient/httpClient');
jest.mock('../../../util/accessTokenGenerator');

jest.mock('../../../middleware/authMiddleware', () => ({
    authMiddleware: (req, res, next) => next(),
}));
jest.mock('../../../initializer', () => ({
    initializer: (req, res, next) => next(),
}));

jest.mock('../../../service/auth/authorizationService', () => ({
    isAuthorizedRequest: () => true,
}));

describe('routes: /pricing-data', () => {
    test('get /pricing-data should return correct response with HTTP OK when the flow is correct', async () => {
        jest.setTimeout(100000);
        await request(app.app)
            .post('/v1/pci-bff/pricing/pricing-data')
            .send(pricingDataMockRequest.body)
            .set('Accept', 'application/json')
            .then((res) => {
                expect(res.status).toEqual(HttpStatus.OK);
                expect(res.body).toBeDefined();
                expect(res.body).toEqual(aggregatedPricingMockResponst);
            });
    });

    test('get /pricing-data should return error when an invalid content type is sent',
        async () => {
            jest.setTimeout(100000);
            const res = await request(app.app)
                .post('/v1/pci-bff/pricing/pricing-data')
                .send({})
                .set('Accept', 'application/something');
            expect(res.body.cause).toEqual(ERROR_IN_GETTING_S3_OUTPUT_SIGNED_URL_UNSUPPORTED_REQUEST_BODY);
            expect(res.body.errorCode).toEqual(PRICING_DATA_INVALID_PAYLOAD_ERROR_CODE);
            expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
        });

    test('get /pricing-data should return error response when the pricing call catches an error', async () => {
        jest.setTimeout(100000);
        const res = await request(app.app)
            .post('/v1/pci-bff/pricing/pricing-data')
            .send(cloudPricingErrorMockRequest.body)
            .set('Accept', 'application/json');

        expect(res.body).toEqual(pricingDataMockResponseThrowErrorForCloudPricingCall);
        expect(res.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    });
});
