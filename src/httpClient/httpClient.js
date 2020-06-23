/**
 * Client for HTTP calls
 *
 * @author: gkar5861 on 10/06/20
 **/
import axios from 'axios';
import HttpClientException from '../exception/httpClientException';

class HttpClient {
    constructor(configs) {
        this.axiosInstance = axios.create(configs);
    }

    async makeRequest(method, url, data, headers, params) {
        try {
            return await this.axiosInstance({
                method,
                url,
                data,
                headers,
                params,
            });
        } catch (error) {
            throw new HttpClientException(error);
        }
    }
}

export default HttpClient;
export const httpClient = new HttpClient();
