/**
 * Client for Api Central calls
 *
 * @author: cwic0864 on 05/08/20
 * */

import {UNAUTHORIZED} from 'http-status-codes';
import HttpClient from './httpClient';
import {API_CENTRAL_EXCEPTION} from '../exception/exceptionCodes';
import {API_CENTRAL_ACCESS_TOKEN_EXPIRED} from '../util/logCodes';
import HttpClientException from '../exception/httpClientException';
import {getAccessToken} from '../util/accessTokenGenerator';
import logger from '../util/logger';
import { getCorrelationId } from '../util/correlationIdGenerator';

class ApiCentral extends HttpClient {
    constructor() {
        const configs = {
            baseURL: `${process.env.API_CENTRAL_BASE_URL}/sm`,
            headers: {
                'Content-Type': 'application/json',
            },
        };
        super(configs);

        ['get'].forEach((method) => {
            this[method] = async (url, pageNumber, pageSize, configurations = {}) => {
                try {
                    const headers = {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'accept-encoding': 'gzip',
                        'correlation-id': getCorrelationId() || 'correlation id dropped from the bff',
                    };
                    return await this.apiCentralMakeRequest(
                        method, url, null, headers, pageNumber, pageSize, configurations,
                    );
                } catch (error) {
                    if (error instanceof HttpClientException) {
                        error.setErrorCode(API_CENTRAL_EXCEPTION);
                        throw error;
                    }
                    throw error;
                }
            };
        });

        ['post', 'put', 'delete'].forEach((method) => {
            this[method] = async (url, data, pageNumber, pageSize, configurations = {}) => {
                try {
                    const headers = {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'accept-encoding': 'gzip',
                        'correlation-id': getCorrelationId() || 'correlation id dropped from the bff',
                    };
                    return await this.apiCentralMakeRequest(
                        method, url, data, headers, pageNumber, pageSize, configurations,
                    );
                } catch (error) {
                    if (error instanceof HttpClientException) {
                        error.setErrorCode(API_CENTRAL_EXCEPTION);
                        throw error;
                    }
                    throw error;
                }
            };
        });
    }

    async apiCentralMakeRequest(type, url, data, headers, pageNumber, pageSize, configurations = {}) {
        let response = null;
        try {
            const headersWithAccessToken = {
                ...headers,
                authorization: await getAccessToken(false),
            };
            response = await this.makeRequest(
                type, url, data, headersWithAccessToken, pageNumber, pageSize, configurations,
            );
        } catch (error) {
            if (error instanceof HttpClientException && error.getStatus() === UNAUTHORIZED) {
                logger.info('API central access token expired, retrying with a new token',
                    API_CENTRAL_ACCESS_TOKEN_EXPIRED);
                const headersWithAccessToken = {
                    ...headers,
                    authorization: await getAccessToken(true),
                };
                response = await this.makeRequest(
                    type, url, data, headersWithAccessToken, pageNumber, pageSize, configurations,
                );
            } else {
                throw error;
            }
        }
        return response;
    }
}

export default new ApiCentral();
