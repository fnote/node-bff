/**
 * Cloud pricing Service unit tests
 *
 * @author: adis0892 on 05/08/20
 * */

import CloudPricingDataService from "../pricing/cloudPricingDataService";
import {jest} from "@jest/globals";
import {
    cloudPricingMockRequest,
    cloudPricingMockRequestForErrorScenario,
    cloudPricingMockResponse
} from "../../config/test.config";

jest.mock('../../httpClient/httpClient');

const mockResponse = {};

describe('Cloud Pricing Data Service', () => {
    test('should generate the correct response when flow is correct', async () => {
        const response = await CloudPricingDataService.getCloudPricingData(cloudPricingMockRequest, mockResponse);
        expect(response).toEqual(cloudPricingMockResponse);
    });

    test('should throw an exception when pricing http call fails', async () => {
        try {
            await CloudPricingDataService.getCloudPricingData(cloudPricingMockRequestForErrorScenario, mockResponse);
        } catch (e) {
            expect(e.message).toEqual("Failed to fetch data from Cloud Pricing Endpoint");
        }
    });
});
