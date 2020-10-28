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
    cloudPricingDataMockRequest,
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
            .send({"businessUnitNumber":"068","customerAccount":"758028","priceRequestDate":"20200605","requestedQuantity":3,"product":{"supc":"7203474","splitFlag":false}})
            .set('Accept', 'application/json')
            .then((res) => {
                expect(res.status).toEqual(HttpStatus.OK);
                expect(res.body).toBeDefined();
                expect(res.body).toEqual({
                    businessUnitNumber: '068',
                    customerAccount: '758026',
                    customerType: 'TRS',
                    priceRequestDate: '20201026',
                    requestStatuses: [],
                    product: {
                      id: '7203474',
                      name: 'BEEF RIBEYE LIPON CH 112A',
                      pack: '5',
                      size: 'HEAVY',
                      brandId: 'IBP',
                      brand: 'IOWA BEEF PROCESSORS',
                      stockIndicator: 'N',
                      averageWeight: 30,
                      catchWeightIndicator: 'N',
                      split: 'N',
                      shipSplitOnly: 'N',
                      priceSourceName: 'Exception',
                      supc: '7203474',
                      splitFlag: true,
                      shipSplitsOnlyFlag: true,
                      priceZoneId: 0,
                      quantity: 12,
                      unitsPerCase: 12,
                      perWeightFlag: false,
                      averageNetWeight: 23.5,
                      grossPrice: 2.61,
                      referencePriceRoundingAdjustment: 0,
                      customerReferencePrice: 2.61,
                      customerPrequalifiedPrice: 2.61,
                      unitPrice: 23.18,
                      netPrice: 23.22,
                      agreementIndicators: [],
                      priceSource: 96,
                      minPrice: 0,
                      minHandlingFlag: '',
                      grossCommissionBasis: 2.55,
                      handPricingAllowedFlag: false,
                      originalSupc: null,
                      subReasonCode: null,
                      orderPrice: null,
                      orderPriceType: null,
                      statuses: [],
                      priceRule: {
                        name: 'NEWTRS',
                        baseValue: 2.55,
                        factorCalcMethod: 'MGN',
                        factorSign: '+',
                        factorValue: 2
                      },
                      agreements: [
                        {
                            "id": "195950",
                            "type": "BDEP",
                            "applicationCode": "L",
                            "description": "PRICING BOTTLE DEPOSIT TEST",
                            "priceAdjustment": 0.04,
                            "priceAdjustmentCode": "C",
                            "rebateBasis": "DC",
                            "methodCode": "OFF INVOICE LINE",
                            "effectiveFrom": "20200915",
                            "effectiveTo": "20201231"
                        }
                    ],
                      exception: {
                        id: '100',
                        price: 23.18,
                        effectiveFrom: '20200818',
                        effectiveTo: '20201030'
                      },
                      discounts: [],
                      volumePricingTiers: []
                    }
                  });
            });
    });

    test('get /pricing-data should return error response when the pricing call catches an error', async () => {
        jest.setTimeout(100000);
        const res = await request(app.app)
            .post('/v1/pci-bff/pricing/pricing-data')
            .send({"businessUnitNumber":"069","customerAccount":"758028","priceRequestDate":"20200605","requestedQuantity":3,"product":{"supc":"7203474","splitFlag":false}})
            .set('Accept', 'application/json');

        expect(res.body).toEqual(pricingDataMockResponseThrowErrorForCloudPricingCall);
        expect(res.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    });
});
