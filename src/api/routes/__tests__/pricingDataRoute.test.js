/**
 * Pricing data routes unit tests
 *
 * @author: adis0892 on 28/07/20
 * */

import request from "supertest";
import {app} from "../../../app";
import * as HttpStatus from "http-status-codes";
import {jest} from "@jest/globals";
import {
    pricingDataMockRequest,
    pricingDataMockRequestForErrorOnCloudPricingCall,
    pricingDataMockRequestThrowErrorForCloudPricingCall,
    PricingDataMockResponse,
    PricingDataMockResponseForErrorOnCloudPricingCall,
    pricingDataMockResponseThrowErrorForCloudPricingCall
} from "../../../config/test.config";

jest.mock('../../../httpClient/httpClient');

jest.mock('../../../middleware/authMiddleware', () => ({
    authMiddleware: (req, res, next) => {
        return next();
    }
}));

describe('routes: /pricing-data', () => {
    test('get /pricing-data should return correct response with HTTP OK when the flow is correct', async () => {
       await request(app)
            .post('/v1/pci-bff/pricing/pricing-data')
            .send(pricingDataMockRequest)
            .set('Accept', 'application/json')
           .then((res) => {
               expect(res.status).toEqual(HttpStatus.OK);
               expect(res.body).toBeDefined();
               expect(res.body).toEqual(PricingDataMockResponse);
               expect(res.body.cloudPricingResponse.cloudPricingResponseStatus).toEqual(HttpStatus.OK);
               expect(res.body.itemInfoResponse.itemInfoResponseStatus).toEqual(HttpStatus.OK);
               }
           );
    });

    test('get /pricing-data should return correct status (Eg: HttpStatus.BAD_GATEWAY) in cloud pricing json when only ' +
        'cloud pricing response failed with that code', async () => {
        await request(app)
            .post('/v1/pci-bff/pricing/pricing-data')
            .send(pricingDataMockRequestForErrorOnCloudPricingCall)
            .set('Accept', 'application/json')
            .then((res) => {
                    expect(res.status).toEqual(HttpStatus.OK);
                    expect(res.body).toBeDefined();
                    expect(res.body).toEqual(PricingDataMockResponseForErrorOnCloudPricingCall);
                    expect(res.body.cloudPricingResponse.cloudPricingResponseStatus).toEqual(HttpStatus.BAD_GATEWAY);
                    expect(res.body.itemInfoResponse.itemInfoResponseStatus).toEqual(HttpStatus.OK);
                }
            );
    });

    test('get /pricing-data should return error response when the pricing call catches an error', async () => {
        jest.setTimeout(10000);
        const res = await request(app)
            .post('/v1/pci-bff/pricing/pricing-data')
            .send(pricingDataMockRequestThrowErrorForCloudPricingCall)
            .set('Accept', 'application/json')

        expect(res.body).toEqual(pricingDataMockResponseThrowErrorForCloudPricingCall);
        expect(res.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);

    });
});