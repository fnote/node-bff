import {getSeedApiConfig} from '../../config/configs';
import SeedApiDataFetchException from '../../exception/seedApiDataFechException';
import {getCorrelationId} from '../../util/correlationIdGenerator';
import {getAccessToken} from '../../util/accessTokenGenerator';
// constants
import {
    APPLICATION_JSON, CORRELATION_ID_HEADER,
    UNKNOWN_SEED_API_ERROR_MESSAGE,
    GENERIC_SEED_API_ERROR_MESSAGE,
    HTTP_GET,
    HTTP_POST,
    CLOUD_PCI_CLIENT_ID,
} from '../../util/constants';
import {UNKNOWN_SEED_API_ERROR, UNKNOWN_SEED_API_CAUGHT_ERROR} from '../../exception/exceptionCodes';

import {httpClient} from '../../httpClient/PZRHttpClient';

class SeedService {
    constructor() {
        this.seedApiConfig = getSeedApiConfig();
        this.timeout = Number(process.env.SEED_API_TIMEOUT);
    }

    static async constructHeaders() {
        // const accessToken = await getAccessToken(false);
        return ({
            'Content-type': APPLICATION_JSON,
            Accept: APPLICATION_JSON,
            'client-id': CLOUD_PCI_CLIENT_ID,
            [CORRELATION_ID_HEADER]: getCorrelationId(),
            // BearerAuth: accessToken,
        });
    }

    static handleError(error) {
        if (error && error.response && error.response.data) {
            const errorData = error.response.data;
            const errorCode = Number(errorData.code);
            const errorMesssage = errorData.message ? errorData.message : GENERIC_SEED_API_ERROR_MESSAGE;
            if (errorCode) {
                throw new SeedApiDataFetchException(error, errorMesssage, errorCode);
            }
            throw new SeedApiDataFetchException(error, UNKNOWN_SEED_API_ERROR_MESSAGE, UNKNOWN_SEED_API_ERROR);
        }
        throw new SeedApiDataFetchException(error, UNKNOWN_SEED_API_ERROR_MESSAGE, UNKNOWN_SEED_API_CAUGHT_ERROR);
    }

    async getSeedItemAttributeGroupsData() {
        const headers = await SeedService.constructHeaders();
        const reqUrl = `${this.seedApiConfig.CONFIG.seedApiBaseUrl + this.seedApiConfig.CONFIG.getItemAttributeGroupsEndpoint}`;
        return httpClient.makeRequest({
            method: HTTP_GET,
            reqUrl,
            data: null,
            headers,
            param: null,
            timeout: this.timeout,
        }).then((response) => response).catch((error) => SeedService.handleError(error));
    }

    async getPriceZoneDetailsForCustomerAndItemAttributeGroup(req) {
        const headers = await SeedService.constructHeaders();
        const reqUrl = this.seedApiConfig.CONFIG.seedApiBaseUrl + this.seedApiConfig.CONFIG.getCustomerAndItemAttributeGroupsEndpoint;
        return httpClient.makeRequest({
            method: HTTP_POST,
            reqUrl,
            data: req.body,
            headers,
            params: null,
            timeout: this.timeout,
        }).then((response) => response).catch((error) => SeedService.handleError(error));
    }

    async getPriceZoneDetailsForCustomerGroupAndItemAttributeGroup(req) {
        const headers = await SeedService.constructHeaders();
        const reqUrl = this.seedApiConfig.CONFIG.seedApiBaseUrl + this.seedApiConfig.CONFIG.getCustomerGroupAndItemAttributeGroupsEndpoint;
        return httpClient.makeRequest({
            method: HTTP_POST,
            reqUrl,
            data: req.body,
            headers,
            params: null,
            timeout: this.timeout,
        }).then((response) => response).catch((error) => SeedService.handleError(error));
    }
}

export default new SeedService();
