// import {httpClient} from '../../httpClient/httpClient';
import { getCIPZApiConfig } from '../../config/configs';
import logger from '../../util/logger';
import CipzApiDataFetchException from '../../exception/cipzApiDataFetchException';
import { getCorrelationId } from '../../util/correlationIdGenerator';
import {
    ERROR_IN_GETTING_CIPZ_PRICE_ZONE_UPDATE_DATA,
    ERROR_IN_FETCHING_SEED_ITEM_ATTRIBUTE_GROUP_DATA,
    APPLICATION_JSON, CORRELATION_ID_HEADER,
    ERROR_IN_RESPONSING_CIPZ_PRICE_ZONE_APPROVAL_REQ,
    // HTTP_GET,
    HTTP_POST,
    // HTTP_PATCH,
    ERROR_IN_CREATING_CIPZ_PRICE_ZONE_UPDATE,
} from '../../util/constants';
import {
    CIPZ_API_DATA_FETCH_ERROR_CODE,
    CIPZ_API_CREATE_PRICE_ZONE_UPDATE_ERROR_CODE,
    ERROR_IN_FETCHING_SEED_ITEM_ATTRIBUTE_GROUP_DATA_CODE,
    UPDATING_CIPZ_PRICE_ZONE_SUBMITTED_REQ_ERROR_CODE,

} from '../../exception/exceptionCodes';
import {
    cipzApiGetSubmittedRequestMockResponse,
    cipzApiGetPriceZoneUpdateMockData,
    cipzApiRespnseToApproveRequestMockData,
    cipzCreatePriceZoneChangeMockResponse,
} from '../cipzMockData';
import {httpClient} from '../../httpClient/httpClient';

class PriceZoneReassignmentService {
    constructor() {
        this.CipzConfig = getCIPZApiConfig();
    }

    async constructHeaders() {
        return ({
            'Content-type': APPLICATION_JSON,
            Accept: APPLICATION_JSON,
            clientID: this.CipzConfig.CONFIG.clientId,
            [CORRELATION_ID_HEADER]: getCorrelationId(),
        });
    }

    async getCIPZSubmittedRequestData(query) {
        const params = {
                limit: query.limit,
                offset: query.offset,
                request_status: query.request_status,
        };
        try {
            const headers = await this.constructHeaders();
            const reqUrl = this.CipzConfig.CONFIG.cipzApiBaseUrl + this.CipzConfig.CONFIG.getSubmittedRequestEndpoint;
            logger.info({headers, reqUrl, params});
            // return httpClient.makeRequest(HTTP_GET, reqUrl, undefined, headers, params);
            return (cipzApiGetSubmittedRequestMockResponse.data);
        } catch (e) {
            const errorMessage = ERROR_IN_FETCHING_SEED_ITEM_ATTRIBUTE_GROUP_DATA;
            const errorCode = ERROR_IN_FETCHING_SEED_ITEM_ATTRIBUTE_GROUP_DATA_CODE;
            logger.error(`${errorMessage} due to: ${e}, stacktrace: ${e.stack}`);
            throw new CipzApiDataFetchException(e, errorMessage, errorCode);
        }
    }

    async getPriceZoneUpdatesData(query, requestId) {
        const params = {
            limit: query.limit,
            offset: query.offset,
            source: query.source,
        };
        try {
            const headers = await this.constructHeaders();
            const reqUrl = this.CipzConfig.CONFIG.cipzApiBaseUrl + this.CipzConfig.CONFIG.getPriceZoneUpdateEndpoint + requestId;
            logger.info({headers, reqUrl, params});
            // return httpClient.makeRequest(HTTP_GET, reqUrl, null, headers, params);
            return (cipzApiGetPriceZoneUpdateMockData.data);
        } catch (e) {
            const errorMessage = ERROR_IN_GETTING_CIPZ_PRICE_ZONE_UPDATE_DATA;
            const errorCode = UPDATING_CIPZ_PRICE_ZONE_SUBMITTED_REQ_ERROR_CODE;
            logger.error(`${errorMessage} due to: ${e}, stacktrace: ${e.stack}`);
            throw new CipzApiDataFetchException(e, errorMessage, errorCode);
        }
    }

    async reviewSubmission(body) {
        try {
            const headers = await this.constructHeaders();
            const reqUrl = this.CipzConfig.CONFIG.cipzApiBaseUrl + this.CipzConfig.CONFIG.patchApproveRejectApprovalReqEndpoint;
            logger.info({headers, reqUrl, body});
            // return httpClient.makeRequest(HTTP_PATCH, reqUrl, body, headers);
            return (cipzApiRespnseToApproveRequestMockData.data);
        } catch (e) {
            const errorMessage = ERROR_IN_RESPONSING_CIPZ_PRICE_ZONE_APPROVAL_REQ;
            const errorCode = CIPZ_API_DATA_FETCH_ERROR_CODE;
            logger.error(`${errorMessage} due to: ${e}, stacktrace: ${e.stack}`);
            throw new CipzApiDataFetchException(e, errorMessage, errorCode);
        }
    }

    async createPriceZoneChange(req) {
        try {
            // const headers = await this.constructHeaders();
            // const reqUrl = this.CipzConfig.CONFIG.cipzApiBaseUrl + this.CipzConfig.CONFIG.createPriceZoneUpdateEndpoint;
            // return httpClient.makeRequest(HTTP_POST, reqUrl, req.body, headers);
            return (cipzCreatePriceZoneChangeMockResponse.data);
        } catch (error) {
            throw new CipzApiDataFetchException(error, ERROR_IN_CREATING_CIPZ_PRICE_ZONE_UPDATE, CIPZ_API_CREATE_PRICE_ZONE_UPDATE_ERROR_CODE);
        }
    }
}

export default new PriceZoneReassignmentService();
