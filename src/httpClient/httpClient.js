import axios from 'axios';
import HttpException from '../exception/HttpException';

class HttpClient {
    constructor(configs) {
        this.axiosInstance = axios.create(configs);
    }

    async makeRequest(type, URL, data, headers, paramsList) {
        try {
            const response = await this.axiosInstance({
                url: URL,
                data,
                method: type,
                headers,
                params: paramsList,
            });
            return response;
        } catch (error) {
            throw new HttpException(error, REST_CLIENT_EXCEPTION);
        }
    }
}

export default HttpClient;
export const httpClient = new HttpClient();
