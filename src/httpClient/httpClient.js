/**
 * Client for HTTP calls
 *
 * @author: gkar5861 on 10/06/20
 * */
import axios from 'axios';
import HttpClientException from '../exception/httpClientException';

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
            throw new HttpClientException(error);
        }
    }
}

export default new HttpClient();
