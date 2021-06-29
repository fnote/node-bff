import { getSeedApiConfig } from '../../config/configs';
import SeedApiDataFetchException from '../../exception/seedApiDataFechException';
import { getCorrelationId } from '../../util/correlationIdGenerator';
import {
    ERROR_IN_GETTING_SEED_SEARCH_RESULTS,
    ERROR_IN_FETCHING_SEED_ITEM_ATTRIBUTE_GROUP_DATA,
    APPLICATION_JSON, CORRELATION_ID_HEADER,
    HTTP_GET,
    HTTP_POST,
    SEED_API,
} from '../../util/constants';
import { getAccessToken } from '../../util/accessTokenGenerator';
import {
    SEED_API_ERROR_CODES_MAP,
    CIPZ_SEED_VALIDATION_AND_GENERAL_ERROR_CODES,
} from '../../exception/exceptionCodes';
import { httpClient } from '../../httpClient/PZRHttpClient';

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

    async getSeedItemAttributeGroupsData() {
        try {
            const headers = await this.constructHeaders();
            const reqUrl = this.seedApiConfig.CONFIG.seedApiBaseUrl + this.seedApiConfig.CONFIG.getItemAttributeGroupsEndpoint;
            return httpClient.makeRequest({
                method: HTTP_GET,
                reqUrl,
                data: null,
                headers,
                param: null,
                api: SEED_API,
            });
        } catch (error) {
            throw new SeedApiDataFetchException(error, ERROR_IN_FETCHING_SEED_ITEM_ATTRIBUTE_GROUP_DATA,
                CIPZ_SEED_VALIDATION_AND_GENERAL_ERROR_CODES.SEED_API_ITEM_ATT_GROUP_FETCH_ERROR_CODE);
        }
    }

    async getPriceZoneDetailsForCustomerAndItemAttributeGroup(req) {
        try {
            const headers = await this.constructHeaders();
            const reqUrl = this.seedApiConfig.CONFIG.seedApiBaseUrl + this.seedApiConfig.CONFIG.getCustomerAndItemAttributeGroupsEndpoint;
            return httpClient.makeRequest({
                method: HTTP_POST,
                reqUrl,
                data: req.body,
                headers,
                params: null,
                api: SEED_API,
            });
        } catch (error) {
            throw new SeedApiDataFetchException(error, ERROR_IN_GETTING_SEED_SEARCH_RESULTS, SEED_API_ERROR_CODES_MAP.SEARCH_BY_CUSTOMER_ERROR_CODE);
        }
    }

    async getPriceZoneDetailsForCustomerGroupAndItemAttributeGroup(req) {
        try {
            const headers = await this.constructHeaders();
            const reqUrl = this.seedApiConfig.CONFIG.seedApiBaseUrl + this.seedApiConfig.CONFIG.getCustomerGroupAndItemAttributeGroupsEndpoint;
            return httpClient.makeRequest({
                method: HTTP_POST,
                reqUrl,
                data: req.body,
                headers,
                params: null,
                api: SEED_API,
            });
        } catch (error) {
            throw new SeedApiDataFetchException(error, ERROR_IN_GETTING_SEED_SEARCH_RESULTS,
                 SEED_API_ERROR_CODES_MAP.SEARCH_BY_CUSTOMER_GROUP_ERROR_CODE);
        }
    }
}

export default new SeedService();
