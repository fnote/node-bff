import axios from 'axios';

class HttpClient {
    constructor(configs) {
        this.axiosInstance = axios.create(configs);
    }

    async makeRequest({
                          method, reqUrl, data, headers, params,
                      }) {
        return this.axiosInstance({
            method,
            url: reqUrl,
            data,
            headers,
            params,
        });
    }
}

export const httpClient = new HttpClient();
