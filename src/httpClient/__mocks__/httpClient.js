/**
 * HTTP Client mock
 *
 * @author: gkar5861 on 23/06/20
 * */

import {
    cloudPCIPricingMockResponse,
    cloudPricingDataMockRequest,
    cloudPricingErrorMockRequest,
    cloudPricingMockRequest,
    cloudPricingMockRequestForErrorScenario,
    cloudPricingMockResponse,
    cloudPricingMockResponseForAggregatedErrorPricingCall,
    cloudPricingMockResponseForAggregatedPricingCall,
    cloudPricingPCIMockRequest,
    customerInfoMockResponse,
    mockBatchApiInputUrlRequest,
    mockBatchApiOutputUrlRequest,
    mockErrorBatchApiRequest,
    mockErrorDeleteRequestSignedUrl,
    mockRequestOutputSignedUrl,
    mockResponseFileList,
    mockResponseSignedUrl,
    pricingDataMockRequestForErrorOnCloudPricingCall,
    pricingDataMockRequestThrowErrorForCloudPricingCall,
    productInfoMockResponse,
} from '../../config/test.config';
import HttpClientException from '../../exception/httpClientException';
import {BATCH_API_DATA_FETCH_ERROR_CODE, HTTP_CLIENT_EXCEPTION} from '../../exception/exceptionCodes';
import {HTTP_DELETE, HTTP_GET, HTTP_POST} from "../../util/constants";

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
        if (URL.includes('/batch/files/signed-url/input') && method === HTTP_POST
            && JSON.stringify(data) === JSON.stringify(mockBatchApiInputUrlRequest)) {
            return mockResponseSignedUrl;
        }
        if (URL.includes('/batch/files/signed-url/output') && method === HTTP_POST
            && JSON.stringify(data) === JSON.stringify(mockBatchApiOutputUrlRequest)) {
            return mockResponseSignedUrl;
        }
        if (URL.includes('/batch/files/signed-url/') && method === HTTP_POST
            && JSON.stringify(data) === JSON.stringify(mockErrorBatchApiRequest)) {
            throw new HttpClientException('Http client exception', BATCH_API_DATA_FETCH_ERROR_CODE);
        }
        if (URL.includes('/batch/files/output/ERR') && method === HTTP_GET) {
            throw new HttpClientException('Http client exception', BATCH_API_DATA_FETCH_ERROR_CODE);
        }
        if (URL.includes('/batch/files/output') && method === HTTP_GET) {
            return mockResponseFileList;
        }
        if (URL.includes('/batch/files/output') && method === HTTP_DELETE
            && JSON.stringify(data) === JSON.stringify(mockRequestOutputSignedUrl)) {
            return mockResponseSignedUrl;
        }
        if (URL.includes('/batch/files/output') && method === HTTP_DELETE
            && JSON.stringify(data) === JSON.stringify(mockErrorDeleteRequestSignedUrl)) {
            throw new HttpClientException('Http client exception', BATCH_API_DATA_FETCH_ERROR_CODE);
        }
        if (JSON.stringify(data) === JSON.stringify(cloudPricingErrorMockRequest.body)) {
            return {data2: cloudPricingMockResponse};
        }
        if (JSON.stringify(data) === JSON.stringify(cloudPricingMockRequest.body)) {
            return { data: cloudPricingMockResponse };
        }
        if (JSON.stringify(data) === JSON.stringify(cloudPricingPCIMockRequest.body)) {
            return { data: cloudPCIPricingMockResponse };
        }
        if (JSON.stringify(data) === JSON.stringify(cloudPricingMockRequest.body)) {
            return cloudPricingMockResponse;
        }
        if (URL.includes('/opcos/068/products/7203474')) {
            return productInfoMockResponse;
        }
        if (URL.includes('/opcos/068/customers/758028')) {
            return customerInfoMockResponse;
        }
        if (URL.includes('/opcos/019/customers/622548')) {
            return customerInfoMockResponse;
        }
        if (URL.includes('/opcos/999/products/9999999')) {
            throw new HttpClientException('Http client exception', HTTP_CLIENT_EXCEPTION);
        }
        if (JSON.stringify(data) === JSON
            .stringify(cloudPricingMockRequestForErrorScenario.body)) {
            throw new HttpClientException({
                response: {
                    data: { message: 'HTTP_CLIENT_EXCEPTION', code: 222 },
                    status: 'error status',
                    headers: 'error headers',
                },
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
