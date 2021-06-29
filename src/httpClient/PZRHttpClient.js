import axios from 'axios';
import HttpClientException from '../exception/httpClientException';
import { HTTP_CLIENT_EXCEPTION } from '../exception/exceptionCodes';
import { CIPZAPIToPZRErrorMap, SeedAPIToPZRErrorMap } from '../exception/exceptionCodeMapping';
import SeedApiDataFetchException from '../exception/seedApiDataFechException';
import CipzApiDataFetchException from '../exception/cipzApiDataFetchException';
import { CIPZ_API, CIPZ_VALIDATION, SEED_API } from '../util/constants';

class HttpClient {
    constructor(configs) {
        this.axiosInstance = axios.create(configs);
    }

    async makeRequest({
        method, reqUrl, data, headers, params, api,
    }) {
        try {
            return await this.axiosInstance({
                method,
                url: reqUrl,
                data,
                headers,
                params,
            });
        } catch (error) {
            if (api) {
                await this.errorMap(error, api);
            }
            throw new HttpClientException(error, HTTP_CLIENT_EXCEPTION);
        }
    }

    async errorMap(error, api) {
        if (!error || !error.response) {
            throw new HttpClientException(error, HTTP_CLIENT_EXCEPTION);
        }
        const errorData = error.response.data;
        const errorCode = Number(errorData.code);
        const errorMesssage = errorData.message;
        if (api === SEED_API && SeedAPIToPZRErrorMap.get(errorCode)) {
            throw new SeedApiDataFetchException(error, errorMesssage, SeedAPIToPZRErrorMap.get(errorCode));
        } else if ((api === CIPZ_API && CIPZAPIToPZRErrorMap.get(errorCode))) {
            throw new CipzApiDataFetchException(error, errorMesssage, CIPZAPIToPZRErrorMap.get(errorCode));
        } else if (api === CIPZ_VALIDATION) {
            throw new CipzApiDataFetchException(error, errorMesssage, errorCode);
        }
        throw new HttpClientException(error, HTTP_CLIENT_EXCEPTION);
    }
}

export default HttpClient;
export const httpClient = new HttpClient();
