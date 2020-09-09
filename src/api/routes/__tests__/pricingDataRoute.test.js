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
    pricingDataMockRequestThrowErrorForCloudPricingCall,
    PricingDataMockResponse,
    pricingDataMockResponseThrowErrorForCloudPricingCall,
} from '../../../config/test.config';

jest.mock('../../../httpClient/httpClient');
jest.mock('../../../util/accessTokenGenerator');

jest.mock('../../../middleware/authMiddleware', () => ({
    authMiddleware: (req, res, next) => next(),
}));
jest.mock('../../../initializer', () => ({
    initializer: (req, res, next) => next(),
}));

jest.mock('../../../service/auth/authorizationService', () => ({
    isAuthorizedRequest: () => {
        return true;
    },

}));

describe('routes: /pricing-data', () => {
    test('get /pricing-data should return correct response with HTTP OK when the flow is correct', async () => {
        jest.setTimeout(100000);
        await request(app.app)
            .post('/v1/pci-bff/pricing/pricing-data')
            .send(pricingDataMockRequest)
            .set('Accept', 'application/json')
            .then((res) => {
                    expect(res.status).toEqual(HttpStatus.OK);
                    expect(res.body).toBeDefined();
                    expect(res.body).toEqual(PricingDataMockResponse);
                    expect(res.body.cloudPricingResponse.cloudPricingResponseStatus)
                        .toEqual(HttpStatus.OK);
                    expect(res.body.itemInfoResponse.itemInfoResponseStatus).toEqual(HttpStatus.OK);
                });
    });

    test('get /pricing-data should return error response when the pricing call catches an error', async () => {
        jest.setTimeout(100000);
        const res = await request(app.app)
            .post('/v1/pci-bff/pricing/pricing-data')
            .send(pricingDataMockRequestThrowErrorForCloudPricingCall)
            .set('Accept', 'application/json');

        expect(res.body).toEqual(pricingDataMockResponseThrowErrorForCloudPricingCall);
        expect(res.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    });
});
