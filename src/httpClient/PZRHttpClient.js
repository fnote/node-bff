import axios from 'axios';

class HttpClient {
    constructor(configs) {
        this.axiosInstance = axios.create(configs);
    }

    async makeRequest({
        method, reqUrl, data, headers, params, timeout,
    }) {
        const requestJson = {
            method, url: reqUrl, data, headers, params, timeout,
        };
        if (!timeout) {
            delete requestJson.timeout;
        }
        return this.axiosInstance(requestJson);
    }
}

export const httpClient = new HttpClient();
