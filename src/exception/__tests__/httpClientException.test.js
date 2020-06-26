/**
 * HttpClient Exception unit tests
 *
 * @author: gkar5861 on 23/06/20
 * */

import * as HttpStatus from 'http-status-codes';
import HttpClientException from '../httpClientException';

const exception = 'Internal Error';

describe('HttpClient Exception', () => {
    test('should return -1 as the error status when the error doesnt have a response body', async () => {
        const httpClientException = new HttpClientException(exception);
        expect(httpClientException.getStatus()).toEqual(-1);
    });

    test('should return the status that provided in the error', async () => {
        const errorResponse = {
            stack: 'stack',
            response: {
                data: exception,
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                headers: 'headers',
            },
        };
        const httpClientException = new HttpClientException(errorResponse);
        expect(httpClientException.getStatus()).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    test('should return -1 as the error status when the error has request; no response', async () => {
        const errorRequest = {
            stack: 'stack',
            request: {
                data: 'request',
            },
        };
        const httpClientException = new HttpClientException(errorRequest);
        expect(httpClientException.getStatus()).toEqual(-1);
    });
});
