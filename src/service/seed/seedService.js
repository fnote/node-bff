import * as HTTP from 'http-status-codes';
import { getSeedApiConfig } from '../../config/configs';
import SeedApiDataFetchException from '../../exception/seedApiDataFechException';
import HttpClientException from '../../exception/httpClientException';
import { getCorrelationId } from '../../util/correlationIdGenerator';
import {
    APPLICATION_JSON, CORRELATION_ID_HEADER,
    UNKNOWN_400_ERROR_IN_SEED_API,
    HTTP_GET,
    HTTP_POST,
    SEED_API,
} from '../../util/constants';
import {HTTP_CLIENT_EXCEPTION, CIPZ_SEED_VALIDATION_AND_GENERAL_ERROR_CODES, SEED_API_ERROR_CODES_MAP } from '../../exception/exceptionCodes';
import { getAccessToken } from '../../util/accessTokenGenerator';

import { httpClient } from '../../httpClient/PZRHttpClient';
import { SeedAPIToPZRErrorMap } from '../../exception/exceptionCodeMapping';

class SeedService {
    constructor() {
        this.seedApiConfig = getSeedApiConfig();
    }

    async constructHeaders() {
        // const accessToken = await getAccessToken(false);
        return ({
            'Content-type': APPLICATION_JSON,
            Accept: APPLICATION_JSON,
            clientID: this.seedApiConfig.CONFIG.clientId,
            [CORRELATION_ID_HEADER]: getCorrelationId(),
            // BearerAuth: accessToken,
        });
    }

    async handleError(error, applicationErrorCode) {
        if (error && error.response && error.response.data) {
            const errorData = error.response.data;
            const errorCode = Number(errorData.code);
            const errorMesssage = errorData.message;
            const httpStatus = error.response.status;
            if (SeedAPIToPZRErrorMap.get(errorCode)) {
                throw new SeedApiDataFetchException(error, errorMesssage, SeedAPIToPZRErrorMap.get(errorCode));
            } else if (httpStatus === HTTP.BAD_REQUEST) {
                throw new SeedApiDataFetchException(error, UNKNOWN_400_ERROR_IN_SEED_API, applicationErrorCode);
            }
        }
        throw new HttpClientException(error, applicationErrorCode);
        }

    async getSeedItemAttributeGroupsData() {
            const headers = await this.constructHeaders();
            const reqUrl = `${this.seedApiConfig.CONFIG.seedApiBaseUrl + this.seedApiConfig.CONFIG.getItemAttributeGroupsEndpoint}`;
            return httpClient.makeRequest({
                method: HTTP_GET,
                reqUrl,
                data: null,
                headers,
                param: null,
            }).then((response) => response).catch((error) => this.handleError(error,
                 CIPZ_SEED_VALIDATION_AND_GENERAL_ERROR_CODES.SEED_API_ITEM_ATT_GROUP_FETCH_ERROR_CODE));
    }

    async getPriceZoneDetailsForCustomerAndItemAttributeGroup(req) {
            const headers = await this.constructHeaders();
            const reqUrl = this.seedApiConfig.CONFIG.seedApiBaseUrl + this.seedApiConfig.CONFIG.getCustomerAndItemAttributeGroupsEndpoint;
            return httpClient.makeRequest({
                method: HTTP_POST,
                reqUrl,
                data: req.body,
                headers,
                params: null,
            }).then((response) => response).catch((error) => this.handleError(error,
                SEED_API_ERROR_CODES_MAP.SEARCH_BY_CUSTOMER_ERROR_CODE));
    }

    async getPriceZoneDetailsForCustomerGroupAndItemAttributeGroup(req) {
            const headers = await this.constructHeaders();
            console.log(req.body);
            const reqUrl = this.seedApiConfig.CONFIG.seedApiBaseUrl + this.seedApiConfig.CONFIG.getCustomerGroupAndItemAttributeGroupsEndpoint;
            return httpClient.makeRequest({
                method: HTTP_POST,
                reqUrl,
                data: req.body,
                headers,
                params: null,
            }).then((response) => response).catch((error) => this.handleError(error,
                SEED_API_ERROR_CODES_MAP.SEARCH_BY_CUSTOMER_GROUP_ERROR_CODE));
    }
}

export default new SeedService();
