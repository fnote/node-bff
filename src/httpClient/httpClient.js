/**
 * Client for HTTP calls
 *
 * @author: gkar5861 on 10/06/20
 * */
import axios from 'axios';
import HttpClientException from '../exception/httpClientException';
import {
    HTTP_CLIENT_EXCEPTION,
    SEED_API_SEARCH_BY_CUSTOMER_ERROR_CODE,
    SEED_API_SEARCH_BY_CUSTOMER_GROUP_ERROR_CODE
} from '../exception/exceptionCodes';
import SeedApiDataFetchException from '../exception/seedApiDataFechException';
import { INVALID_CUSTOMER_ACCOUNT, INVALID_CUSTOMER_GROUP } from '../util/constants';

const SeedToPZRErrorMap= new Map([
    [INVALID_CUSTOMER_ACCOUNT, SEED_API_SEARCH_BY_CUSTOMER_ERROR_CODE],
    [INVALID_CUSTOMER_GROUP, SEED_API_SEARCH_BY_CUSTOMER_GROUP_ERROR_CODE],
]);

class HttpClient {
    constructor(configs) {
        this.axiosInstance = axios.create(configs);
    }

    async makeRequest(method, URL, data, headers, params) {
        try {
            return await this.axiosInstance({
                method,
                url: URL,
                data,
                headers,
                params,
            });
        } catch (error) {
            await this.errorMap(error);
            throw new HttpClientException(error, HTTP_CLIENT_EXCEPTION);
        }
    }

    async errorMap(error) {
        if (error && error.response) {
            const errorData = error.response.data;
            const errorCode = errorData.code;
            const errorMesssage = errorData.message;
            if ([INVALID_CUSTOMER_GROUP, INVALID_CUSTOMER_ACCOUNT].includes(errorCode)) {
                throw new SeedApiDataFetchException(error, errorMesssage, SeedToPZRErrorMap.get(errorCode));
            }
        }
    }
}

export default HttpClient;
export const httpClient = new HttpClient();
