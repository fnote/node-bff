/**
 * Client for HTTP calls
 *
 * @author: gkar5861 on 10/06/20
 * */
import axios from 'axios';
import HttpClientException from '../exception/httpClientException';
import {HTTP_CLIENT_EXCEPTION} from '../exception/exceptionCodes';

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
            throw new HttpClientException(error, HTTP_CLIENT_EXCEPTION);
        }
    }
}

export default HttpClient;
export const httpClient = new HttpClient();
