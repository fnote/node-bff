/**
 * HTTP Client mock
 *
 * @author: gkar5861 on 23/06/20
 * */

import {
    cloudPricingPCIMockRequest,
    cloudPricingErrorMockRequest,
    cloudPricingMockRequest,
    cloudPricingMockRequestForErrorScenario,
    cloudPricingMockResponse,
    cloudPricingMockResponseForAggregatedErrorPricingCall,
    cloudPricingMockResponseForAggregatedPricingCall,
    cloudPricingDataMockRequest,
    pricingDataMockRequestForErrorOnCloudPricingCall,
    pricingDataMockRequestThrowErrorForCloudPricingCall,
    productInfoMockResponse,
    cloudPCIPricingMockResponse,
} from '../../config/test.config';
import HttpClientException from '../../exception/httpClientException';
import {HTTP_CLIENT_EXCEPTION} from '../../exception/exceptionCodes';

const batchApiMockRequestBody = {
    fileNames: [
        'fileName1',
        'fileName2',
    ],
};

const batchApiMockResponse = {
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
    async makeRequest(method, URL, data) {
        const jwkRequestURLForTest = 'https://cognito-idp.us-east-1.amazonaws.com/local/.well-known/jwks.json';
        const resolvedValue = {
            data: {
                keys: [
                    {
                        kid: 'kid1',
                        n: 1,
                        e: 1,
                        kty: 1,
                    },
                    {
                        kid: 'kid2',
                        n: 2,
                        e: 2,
                        kty: 2,
                    },
                ],
            },

        };
        if (JSON.stringify(data) === JSON.stringify(cloudPricingErrorMockRequest.body)) {
            return { data2: cloudPricingMockResponse };
        }
        if (JSON.stringify(data) === JSON.stringify(cloudPricingMockRequest.body)) {
            return { data: cloudPricingMockResponse };
        }
        if (JSON.stringify(data) === JSON.stringify(cloudPricingPCIMockRequest.body)) {
            return { data: cloudPCIPricingMockResponse };
        }
        if (JSON.stringify(data) === JSON.stringify(batchApiMockRequestBody)) {
            return batchApiMockResponse;
        }
        if (JSON.stringify(data) === JSON.stringify(cloudPricingMockRequest.body)) {
            return cloudPricingMockResponse;
        }
        if (URL.includes('/opcos/068/products/7203474')) {
            return productInfoMockResponse;
        }
        if (URL.includes('/opcos/999/products/9999999')) {
            throw new HttpClientException('Http client exception', HTTP_CLIENT_EXCEPTION);
        }
        if (JSON.stringify(data) === JSON
            .stringify(cloudPricingMockRequestForErrorScenario.body)) {
            throw new HttpClientException({
                response: {
                    data: { message: "HTTP_CLIENT_EXCEPTION", code: 222 },
                    status: "error satatus",
                    headers: "error headers"
                }
            });
        } else if (JSON.stringify(data) === JSON
            .stringify(cloudPricingDataMockRequest)) {
            return cloudPricingMockResponseForAggregatedPricingCall;
        } else if (JSON.stringify(data) === JSON
            .stringify(pricingDataMockRequestForErrorOnCloudPricingCall)) {
            return cloudPricingMockResponseForAggregatedErrorPricingCall;
        } else if (JSON.stringify(data) === JSON
            .stringify(pricingDataMockRequestThrowErrorForCloudPricingCall)) {
            throw new Error('test-error');
        } else if (URL === jwkRequestURLForTest) {
            return resolvedValue;
        }
    }
}

export default HttpClient;
export const httpClient = new HttpClient();
