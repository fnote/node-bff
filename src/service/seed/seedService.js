import {getSeedApiConfig} from '../../config/configs';
import SeedApiDataFetchException from '../../exception/seedApiDataFechException';
import {getCorrelationId} from '../../util/correlationIdGenerator';
import {
    APPLICATION_JSON, CORRELATION_ID_HEADER,
    UNKNOWN_SEED_API_ERROR_MESSAGE,
    GENERIC_SEED_API_ERROR_MESSAGE,
    HTTP_GET,
    HTTP_POST,
} from '../../util/constants';

import {UNKNOWN_SEED_API_ERROR} from '../../exception/exceptionCodes';
import {getAccessToken} from '../../util/accessTokenGenerator';

import {httpClient} from '../../httpClient/PZRHttpClient';

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

    handleError(error) {
        if (error && error.response && error.response.data) {
            const errorData = error.response.data;
            const errorCode = Number(errorData.code);
            const errorMesssage = errorData.message ? errorData.message : GENERIC_SEED_API_ERROR_MESSAGE;
            if (errorCode) {
                throw new SeedApiDataFetchException(error, errorMesssage, errorCode);
            }
            throw new SeedApiDataFetchException(error, UNKNOWN_SEED_API_ERROR_MESSAGE, UNKNOWN_SEED_API_ERROR);
        }
        throw new SeedApiDataFetchException(error, UNKNOWN_SEED_API_ERROR_MESSAGE, UNKNOWN_SEED_API_ERROR);
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
        }).then((response) => response).catch((error) => this.handleError(error));
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
        }).then((response) => response).catch((error) => this.handleError(error));
    }

    async getPriceZoneDetailsForCustomerGroupAndItemAttributeGroup(req) {
        const headers = await this.constructHeaders();
        const reqUrl = this.seedApiConfig.CONFIG.seedApiBaseUrl + this.seedApiConfig.CONFIG.getCustomerGroupAndItemAttributeGroupsEndpoint;
        return httpClient.makeRequest({
            method: HTTP_POST,
            reqUrl,
            data: req.body,
            headers,
            params: null,
        }).then((response) => response).catch((error) => this.handleError(error));
    }
}

export default new SeedService();
