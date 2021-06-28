/**
 * Client for HTTP calls
 *
 * @author: gkar5861 on 10/06/20
 * */
import axios from 'axios';
import HttpClientException from '../exception/httpClientException';
import {HTTP_CLIENT_EXCEPTION} from '../exception/exceptionCodes';
import SeedApiDataFetchException from '../exception/seedApiDataFechException';
import { INVALID_CUSTOMER_ACCOUNT, INVALID_CUSTOMER_GROUP } from '../util/constants';

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
                throw new SeedApiDataFetchException(error, errorMesssage, errorCode);
            }
        }
    }
}

export default HttpClient;
export const httpClient = new HttpClient();
