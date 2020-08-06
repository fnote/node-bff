/**
 * HTTP Client mock
 *
 * @author: gkar5861 on 23/06/20
 * */

import {
    cloudPricingMockRequest,
    cloudPricingMockRequestForErrorScenario,
    cloudPricingMockResponse,
    cloudPricingMockResponseForAggregatedErrorPricingCall,
    cloudPricingMockResponseForAggregatedPricingCall,
    pricingDataMockRequest,
    pricingDataMockRequestForErrorOnCloudPricingCall,
    pricingDataMockRequestThrowErrorForCloudPricingCall,
} from "../../config/test.config";

const mockRequestBody = {
    fileNames: [
        'fileName1',
        'fileName2',
    ],
};

const mockResponse = {
    data: [
        {
            fileName: 'fileName1',
            putUrl: 'https://batch-output.s3.amazonaws.com/fileName1?AWSAccessKeyId=ASIAQRLXWZJ',
        },
        {
            fileName: 'fileName2',
            putUrl: 'https://batch-output.s3.amazonaws.com/fileName2?AWSAccessKeyId=ASIAQRLXWZJ',
        },
    ],
};

class HttpClient {
    static async makeRequest(method, URL, data) {
        if (JSON.stringify(data) === JSON.stringify(mockRequestBody)) {
            return mockResponse;
        } else if (JSON.stringify(data) === JSON.stringify(cloudPricingMockRequest.body)) {
            return cloudPricingMockResponse;
        } else if (JSON.stringify(data) === JSON.stringify(cloudPricingMockRequestForErrorScenario.body)) {
            throw new Error('test-error');
        } else if (JSON.stringify(data) === JSON.stringify(pricingDataMockRequest)) {
            return cloudPricingMockResponseForAggregatedPricingCall;
        } else if (JSON.stringify(data) === JSON.stringify(pricingDataMockRequestForErrorOnCloudPricingCall)) {
            return cloudPricingMockResponseForAggregatedErrorPricingCall;
        } else if (JSON.stringify(data) === JSON.stringify(pricingDataMockRequestThrowErrorForCloudPricingCall)) {
            throw new Error('test-error');
        }
    }
}

export default HttpClient;
