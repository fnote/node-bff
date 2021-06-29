import {httpClient} from '../../httpClient/PZRHttpClient';
import { getCIPZApiConfig } from '../../config/configs';
import logger from '../../util/logger';
import CipzApiDataFetchException from '../../exception/cipzApiDataFetchException';
import { getCorrelationId } from '../../util/correlationIdGenerator';
import {
    ERROR_IN_GETTING_CIPZ_PRICE_ZONE_UPDATE_DATA,
    ERROR_IN_FETCHING_SEED_ITEM_ATTRIBUTE_GROUP_DATA,
    APPLICATION_JSON, CORRELATION_ID_HEADER,
    ERROR_IN_RESPONSING_CIPZ_PRICE_ZONE_APPROVAL_REQ,
    HTTP_GET,
    HTTP_PATCH,
    HTTP_POST,
    ERROR_IN_CREATING_CIPZ_PRICE_ZONE_UPDATE,
    CIPZ_API,
} from '../../util/constants';
import {
    CIPZ_SEED_VALIDATION_AND_GENERAL_ERROR_CODES,

} from '../../exception/exceptionCodes';
import {
    cipzCreatePriceZoneChangeMockResponse,
    cipzApiGetSubmittedRequestMockResponse,
    cipzApiGetPriceZoneUpdateMockData,
    cipzApiRespnseToApproveRequestMockData,
} from '../cipzMockData';

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
        //     const headers = await this.constructHeaders();
        //     const reqUrl = this.CipzConfig.CONFIG.cipzApiBaseUrl + this.CipzConfig.CONFIG.getSubmittedRequestEndpoint;
            return cipzApiGetSubmittedRequestMockResponse.data;
            // return httpClient.makeRequest({
            //     method: HTTP_GET,
            //     reqUrl,
            //     data: null,
            //     headers,
            //     params,
            //     api: CIPZ_API,
            // });
        } catch (e) {
            const errorMessage = ERROR_IN_FETCHING_SEED_ITEM_ATTRIBUTE_GROUP_DATA;
            const errorCode = CIPZ_SEED_VALIDATION_AND_GENERAL_ERROR_CODES.ERROR_IN_FETCHING_SEED_ITEM_ATTRIBUTE_GROUP_DATA_CODE;
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
            // const headers = await this.constructHeaders();
            // const reqUrl = this.CipzConfig.CONFIG.cipzApiBaseUrl + this.CipzConfig.CONFIG.getPriceZoneUpdateEndpoint + requestId;
            // return httpClient.makeRequest({
            //     method: HTTP_GET,
            //     reqUrl,
            //     data: null,
            //     headers,
            //     params,
            //     api: CIPZ_API,
            // });
            return cipzApiGetPriceZoneUpdateMockData.data;
        } catch (e) {
            const errorMessage = ERROR_IN_GETTING_CIPZ_PRICE_ZONE_UPDATE_DATA;
            const errorCode = CIPZ_SEED_VALIDATION_AND_GENERAL_ERROR_CODES.UPDATING_CIPZ_PRICE_ZONE_SUBMITTED_REQ_ERROR_CODE;
            logger.error(`${errorMessage} due to: ${e}, stacktrace: ${e.stack}`);
            throw new CipzApiDataFetchException(e, errorMessage, errorCode);
        }
    }

    async reviewSubmission(body) {
        try {
            const headers = await this.constructHeaders();
            const reqUrl = this.CipzConfig.CONFIG.cipzApiBaseUrl + this.CipzConfig.CONFIG.patchApproveRejectApprovalReqEndpoint;
            return cipzApiRespnseToApproveRequestMockData;
            // return httpClient.makeRequest({
            //     method: HTTP_PATCH,
            //     reqUrl,
            //     data: body,
            //     headers,
            //     params: null,
            //     api: CIPZ_API,
            // });
        } catch (e) {
            const errorMessage = ERROR_IN_RESPONSING_CIPZ_PRICE_ZONE_APPROVAL_REQ;
            const errorCode = CIPZ_SEED_VALIDATION_AND_GENERAL_ERROR_CODES.CIPZ_API_DATA_FETCH_ERROR_CODE;
            logger.error(`${errorMessage} due to: ${e}, stacktrace: ${e.stack}`);
            throw new CipzApiDataFetchException(e, errorMessage, errorCode);
        }
    }

    async createPriceZoneChange(req) {
        try {
            // const headers = await this.constructHeaders();
            // const reqUrl = this.CipzConfig.CONFIG.cipzApiBaseUrl + this.CipzConfig.CONFIG.createPriceZoneUpdateEndpoint;
            // return httpClient.makeRequest({
            //     mathod: HTTP_POST,
            //     reqUrl,
            //     data: req.body,
            //     headers,
            //     params: null,
            //     api: CIPZ_API,
            // });
            return (cipzCreatePriceZoneChangeMockResponse.data);
        } catch (error) {
            throw new CipzApiDataFetchException(error, ERROR_IN_CREATING_CIPZ_PRICE_ZONE_UPDATE,
                CIPZ_SEED_VALIDATION_AND_GENERAL_ERROR_CODES.CIPZ_API_CREATE_PRICE_ZONE_UPDATE_ERROR_CODE);
        }
    }
}

export default new PriceZoneReassignmentService();
