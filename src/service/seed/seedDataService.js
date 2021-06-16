import {getSeedApiConfig} from '../../config/configs';
 import logger from '../../util/logger';
 import SeedApiDataFetchException from '../../exception/seedApiDataFechException';
 import { getCorrelationId } from '../../util/correlationIdGenerator';
 import {
     ERROR_IN_FETCHING_SEED_ITEM_ATTRIBUTE_GROUP_DATA,
     APPLICATION_JSON, CORRELATION_ID_HEADER,
    //  HTTP_POST
 } from '../../util/constants';
 import { SEED_API_ITEM_ATT_GROUP_FETCH_ERROR_CODE } from '../../exception/exceptionCodes';
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

    formatRequestPayload(payload) {
        const formattedPayload = { ...payload };
        // if (!formattedPayload.offset) {

        // }
        // if (!formattedPayload.limit) {

        // }
        return formattedPayload;
    }

    async getPriceZoneDetailsForCustomerAndItemAttributeGroup(req) {
        // const headers = await this.constructHeaders();
        // const reqUrl = this.seedApiConfig.CONFIG.seedApiBaseUrl + this.seedApiConfig.CONFIG.getCustomerAndItemAttributeGroupsEndpoint;
        // const payload = this.formatRequestPayload(req);
        // return httpClient.makeRequest(HTTP_POST, reqUrl, payload, headers);
        return (searchByCustomerMockResponse.data);
    }

    async getPriceZoneDetailsForCustomerGroupAndItemAttributeGroup(req) {
        // const headers = await this.constructHeaders();
        // const reqUrl = this.seedApiConfig.CONFIG.seedApiBaseUrl + this.seedApiConfig.CONFIG.getCustomerGroupAndItemAttributeGroupsEndpoint;
        // const payload = this.formatRequestPayload(req);
        // return httpClient.makeRequest(HTTP_POST, reqUrl, payload, headers);
        return (searchByCustomerGroupMockResponse.data);
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
