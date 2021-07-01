import {httpClient} from '../../httpClient/PZRHttpClient';
import {getCIPZApiConfig} from '../../config/configs';
import logger from '../../util/logger';
import CipzApiDataFetchException from '../../exception/cipzApiDataFetchException';
import {getCorrelationId} from '../../util/correlationIdGenerator';
import {
    ERROR_IN_GETTING_CIPZ_PRICE_ZONE_UPDATE_DATA,
    ERROR_IN_FETCHING_SEED_ITEM_ATTRIBUTE_GROUP_DATA,
    APPLICATION_JSON, CORRELATION_ID_HEADER,
    ERROR_IN_RESPONSING_CIPZ_PRICE_ZONE_APPROVAL_REQ,
    HTTP_GET,
    HTTP_PATCH,
    HTTP_POST,
    ERROR_IN_CREATING_CIPZ_PRICE_ZONE_UPDATE,
    CIPZ_API, GENERIC_CIPZ_API_ERROR_MESSAGE, UNKNOWN_CIPZ_API_ERROR_MESSAGE
} from '../../util/constants';
import {
    CIPZ_SEED_VALIDATION_AND_GENERAL_ERROR_CODES,
    HTTP_CLIENT_EXCEPTION,
    UNKNOWN_CIPZ_API_ERROR
} from '../../exception/exceptionCodes';
import {
    cipzCreatePriceZoneChangeMockResponse,
    cipzApiGetSubmittedRequestMockResponse,
    cipzApiGetPriceZoneUpdateMockData,
    cipzApiRespnseToApproveRequestMockData,
} from '../cipzMockData';
import {CIPZAPIToPZRErrorMap} from '../../exception/exceptionCodeMapping';
import HttpClientException from '../../exception/httpClientException';

class PriceZoneReassignmentService {
    constructor() {
        this.CipzConfig = getCIPZApiConfig();
    }

    async constructHeaders() {
        return ({
            'Content-type': APPLICATION_JSON,
            Accept: APPLICATION_JSON,
            'client-id': this.CipzConfig.CONFIG.clientId,
            [CORRELATION_ID_HEADER]: getCorrelationId(),
        });
    }

    handleError(error) {
        console.log("---- inside error---")
        console.log(error)
        if (error && error.response && error.response.data) {
            const errorData = error.response.data;
            const errorCode = Number(errorData.code);
            const errorMesssage = errorData.message ? errorData.message : GENERIC_CIPZ_API_ERROR_MESSAGE;
            if (errorCode) {
                throw new CipzApiDataFetchException(error, errorMesssage, errorCode);
            }
            throw new CipzApiDataFetchException(error, UNKNOWN_CIPZ_API_ERROR_MESSAGE, UNKNOWN_CIPZ_API_ERROR);
        }
        throw new CipzApiDataFetchException(error, UNKNOWN_CIPZ_API_ERROR_MESSAGE, UNKNOWN_CIPZ_API_ERROR);
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
        const headers = await this.constructHeaders();
        const reqUrl = this.CipzConfig.CONFIG.cipzApiBaseUrl + this.CipzConfig.CONFIG.createPriceZoneUpdateEndpoint;
        return httpClient.makeRequest({
            method: HTTP_POST,
            reqUrl,
            data: req.body,
            headers,
            params: null,
        }).then((response) => response.data).catch((error) => this.handleError(error));
    }
}

export default new PriceZoneReassignmentService();
