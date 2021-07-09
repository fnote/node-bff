/**
 * Cloud pricing Service unit tests
 *
 * @author: adis0892 on 05/08/20
 * */

import { jest } from '@jest/globals';
import CloudPricingDataService from '../pricing/cloudPricingDataService';
import {
    pricingDataMockRequest,
    cloudPCIPricingMockResponse,
    cloudPricingMockResponse,
    cloudPricingMockRequestForErrorScenario2,
} from '../../config/test.config';

jest.mock('../../httpClient/httpClient');
jest.mock('../../util/accessTokenGenerator');

describe('Cloud Pricing Data Service', () => {
    test('should generate the correct response from getCloudPricingData when flow is correct', async () => {
        const response = await CloudPricingDataService
            .getCloudPricingData(pricingDataMockRequest);
        expect(response.data).toEqual(cloudPricingMockResponse);
    });

    test('should generate the correct response from getCloudPricingPCIData when flow is correct', async () => {
        const response = await CloudPricingDataService
            .getCloudPricingPCIData(pricingDataMockRequest);
        expect(response.data).toEqual(cloudPCIPricingMockResponse);
    });

    test('should throw an exception when pricing http call fails', async () => {
        try {
            await CloudPricingDataService
                .getCloudPricingData(cloudPricingMockRequestForErrorScenario2);
        } catch (e) {
            expect(e.message).toEqual('Failed to fetch data from Cloud Pricing Endpoint, HTTP_CLIENT_EXCEPTION');
            expect(e.errorCode).toEqual(222);
        }
    });
});
