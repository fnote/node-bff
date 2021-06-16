import {getSeedApiConfig} from '../../config/configs';
 import logger from '../../util/logger';
 import SeedApiDataFetchException from '../../exception/seedApiDataFechException';
 import { getCorrelationId } from '../../util/correlationIdGenerator';
 import {
    ERROR_IN_GETTING_SEED_SEARCH_RESULTS,
    ERROR_IN_FETCHING_SEED_ITEM_ATTRIBUTE_GROUP_DATA,
    APPLICATION_JSON, CORRELATION_ID_HEADER,
    //  HTTP_POST
 } from '../../util/constants';
 import {
     SEED_API_ITEM_ATT_GROUP_FETCH_ERROR_CODE,
     SEED_API_SEARCH_BY_CUSTOMER_ERROR_CODE,
     SEED_API_SEARCH_BY_CUSTOMER_GROUP_ERROR_CODE,
    } from '../../exception/exceptionCodes';
 import {
     seedGetItemAttributeGroupMockResponse,
     searchByCustomerMockResponse,
     searchByCustomerGroupMockResponse,
    } from '../cipzMockData';
//  import {httpClient} from '../../httpClient/httpClient';

 class SeedDataService {
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
        const headers = await this.constructHeaders();
        const reqUrl = this.seedApiConfig.CONFIG.seedApiBaseUrl + this.seedApiConfig.CONFIG.getItemAttributeGroupsEndpoint;
        return this.sendGetRequest(reqUrl, headers);
    }

    async getPriceZoneDetailsForCustomerAndItemAttributeGroup(req) {
        try {
            // const headers = await this.constructHeaders();
            // const reqUrl = this.seedApiConfig.CONFIG.seedApiBaseUrl + this.seedApiConfig.CONFIG.getCustomerAndItemAttributeGroupsEndpoint;
            // return httpClient.makeRequest(HTTP_POST, reqUrl, req.body, headers);
            return (searchByCustomerMockResponse.data);
        } catch (error) {
            throw new SeedApiDataFetchException(error, ERROR_IN_GETTING_SEED_SEARCH_RESULTS, SEED_API_SEARCH_BY_CUSTOMER_ERROR_CODE);
        }
    }

    async getPriceZoneDetailsForCustomerGroupAndItemAttributeGroup(req) {
        try {
            // const headers = await this.constructHeaders();
            // const reqUrl = this.seedApiConfig.CONFIG.seedApiBaseUrl + this.seedApiConfig.CONFIG.getCustomerGroupAndItemAttributeGroupsEndpoint;
            // return httpClient.makeRequest(HTTP_POST, reqUrl, req.body, headers);
            return (searchByCustomerGroupMockResponse.data);
        } catch (error) {
            throw new SeedApiDataFetchException(error, ERROR_IN_GETTING_SEED_SEARCH_RESULTS, SEED_API_SEARCH_BY_CUSTOMER_GROUP_ERROR_CODE);
        }
    }

    async sendGetRequest(reqUrl, headers) {
        try {
            return (seedGetItemAttributeGroupMockResponse.data);
        } catch (e) {
            const errorMessage = ERROR_IN_FETCHING_SEED_ITEM_ATTRIBUTE_GROUP_DATA;
            logger.error(`${errorMessage} due to: ${e}, stacktrace: ${e.stack}`);
            throw new SeedApiDataFetchException(e, errorMessage, SEED_API_ITEM_ATT_GROUP_FETCH_ERROR_CODE);
        }
    }
 }

 export default new SeedDataService();
