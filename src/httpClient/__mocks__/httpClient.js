/**
 * HTTP Client mock
 *
 * @author: gkar5861 on 23/06/20
 * */

import * as HttpStatus from 'http-status-codes';
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
    mockBatchApiDownloadUrlRequest,
    mockBatchApiUploadUrlRequest,
    mockErrorBatchFileDownloadApiRequest,
    mockErrorBatchFileUploadApiRequest,
    mockResponseDeleteJob,
    mockResponseJobList,
    mockResponseSignedUrl,
    pricingDataMockRequestForErrorOnCloudPricingCall,
    pricingDataMockRequestThrowErrorForCloudPricingCall,
    productInfoMockResponse,
} from '../../config/test.config';
import {
    mockSearchResponseWithCutomerGroup,
    mockSearchResponseWithCutomerAccount,
    mockCreatePriceZoneUpdateResponse,
} from '../../config/test.config.pzreassignment';
import HttpClientException from '../../exception/httpClientException';
import {BATCH_API_DATA_FETCH_ERROR_CODE, HTTP_CLIENT_EXCEPTION} from '../../exception/exceptionCodes';
import {HTTP_DELETE, HTTP_GET, HTTP_POST} from '../../util/constants';
import InvalidRequestException from '../../exception/invalidRequestException';

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
            && JSON.stringify(data) === JSON.stringify(mockBatchApiUploadUrlRequest)) {
            return mockResponseSignedUrl;
        }
        if (URL.includes('/batch/files/signed-url/output') && method === HTTP_POST
            && JSON.stringify(data) === JSON.stringify(mockBatchApiDownloadUrlRequest)) {
            return mockResponseSignedUrl;
        }
        if (URL.includes('/batch/files/signed-url/input') && method === HTTP_POST
            && JSON.stringify(data) === JSON.stringify(mockErrorBatchFileUploadApiRequest)) {
            throw new HttpClientException('Http client exception', BATCH_API_DATA_FETCH_ERROR_CODE);
        }
        if (URL.includes('/batch/files/signed-url/output') && method === HTTP_POST
            && JSON.stringify(data) === JSON.stringify(mockErrorBatchFileDownloadApiRequest)) {
            throw new HttpClientException('Http client exception', BATCH_API_DATA_FETCH_ERROR_CODE);
        }
        if (URL.includes('/batch/users/test1234/jobs?pageSize=10&offSet=10') && method === HTTP_GET) {
            return mockResponseJobList;
        }
        if (URL.includes('/batch/users/test12345/jobs') && method === HTTP_GET) {
            throw new InvalidRequestException('Bad request', HttpStatus.BAD_REQUEST, BATCH_API_DATA_FETCH_ERROR_CODE);
        }
        if (URL.includes('/batch/users/test1234/jobs?pageSize') && method === HTTP_GET) {
            throw new HttpClientException('Http client exception', BATCH_API_DATA_FETCH_ERROR_CODE);
        }
        if (URL.includes('/batch/users/test1234/jobs/11112222') && method === HTTP_DELETE) {
            return mockResponseDeleteJob;
        }
        if (URL.includes('/batch/users/test1234/jobs/0') && method === HTTP_DELETE) {
            throw new HttpClientException('Http client exception', BATCH_API_DATA_FETCH_ERROR_CODE);
        }
        if (URL.includes('/batch/users/test12345/jobs/11112222') && method === HTTP_DELETE) {
            throw new InvalidRequestException('Bad request', HttpStatus.BAD_REQUEST, BATCH_API_DATA_FETCH_ERROR_CODE);
        }
        if (JSON.stringify(data) === JSON.stringify(cloudPricingErrorMockRequest.body)) {
            return {data2: cloudPricingMockResponse};
        }
        if (JSON.stringify(data) === JSON.stringify(cloudPricingMockRequest.body)) {
            return {data: cloudPricingMockResponse};
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
        if (URL.includes('/item-price-zone/customer-attribute-group')) {
            return mockSearchResponseWithCutomerAccount;
        }
        if (URL.includes('/item-price-zone/customer-group-attribute-group')) {
            return mockSearchResponseWithCutomerGroup;
        }
        if (URL.includes('/pz-update-requests') && method === HTTP_POST) {
            return mockCreatePriceZoneUpdateResponse;
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
