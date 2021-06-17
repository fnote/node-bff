import { getCIPZApiConfig } from '../../config/configs';
import logger from '../../util/logger';
import CipzApiDataFetchException from '../../exception/cipzApiDataFetchException';
import { getCorrelationId } from '../../util/correlationIdGenerator';
import {
    ERROR_IN_FETCHING_CIPZ_API_DATA,
    INVALID_REQUEST_BODY,
    APPLICATION_JSON, CORRELATION_ID_HEADER,
    HTTP_GET,
    HTTP_PATCH
} from '../../util/constants';
import * as HttpStatus from 'http-status-codes';
import { CIPZ_API_DATA_FETCH_ERROR_CODE, CPIZ_DATA_INVALID_PAYLOAD_ERROR_CODE } from '../../exception/exceptionCodes';
import InvalidRequestException from '../../exception/invalidRequestException';
import { cipzApprovalRequestReqBody } from '../../validator/schema';
import { cipzApiGetSubmittedRequestMockResponse, cipzApiGetPriceZoneUpdateMockData } from '../cipzMockData';

class PriceZoneReassignmentService {

    constructor() {
        this.CipzConfig = getCIPZApiConfig();
    }

    /**
     * Decide what to do if params are not set
     */
    async getCIPZSubmittedRequestData(query) {

        const headers = {
            'Content-type': APPLICATION_JSON,
            Accept: APPLICATION_JSON,
            clientID: this.CipzConfig.CONFIG.clientId,
            [CORRELATION_ID_HEADER]: getCorrelationId(),
        };

        const reqUrl = this.CipzConfig.CONFIG.cipzApiBaseUrl +
            this.CipzConfig.CONFIG.getSubmittedRequestEndpoint;

        const params = {
            limit: query.limit,
            offset: query.offset,
            reqStatus: query.reqStatus
        }

        return this.sendRequest(HTTP_GET, reqUrl, headers, params, undefined);
    }

    /**
     * Decide what to do if params, requestid not set
     */
    async getPriceZoneUpdatesData(query, requestId) {

        const headers = {
            'Content-type': APPLICATION_JSON,
            Accept: APPLICATION_JSON,
            clientID: this.CipzConfig.CONFIG.clientId,
            [CORRELATION_ID_HEADER]: getCorrelationId(),
        };

        const reqUrl = this.CipzConfig.CONFIG.cipzApiBaseUrl +
            this.CipzConfig.CONFIG.getPriceZoneUpdateEndpoint + requestId;

        const params = {
            limit: query.limit,
            offset: query.offset,
            source: query.source
        }

        return this.sendRequest(HTTP_GET, reqUrl, headers, params, undefined);
    }

    async approveRejectApprovalRequest(body) {

        const { error } = cipzApprovalRequestReqBody.validate(body);
        if (error) {

            logger.error(`Request body validation failed in getting CIPZ Approval update request data: 
            ${JSON.stringify(body)}`);

            throw new InvalidRequestException(
                INVALID_REQUEST_BODY,
                HttpStatus.BAD_REQUEST,
                CPIZ_DATA_INVALID_PAYLOAD_ERROR_CODE,
            );
        }

        const headers = {
            'Content-type': APPLICATION_JSON,
            Accept: APPLICATION_JSON,
            clientID: this.CipzConfig.CONFIG.clientId,
            [CORRELATION_ID_HEADER]: getCorrelationId(),
        };

        const reqUrl = this.CipzConfig.CONFIG.cipzApiBaseUrl +
            this.CipzConfig.CONFIG.patchApproveRejectApprovalReqEndpoint;

        return this.sendRequest(HTTP_PATCH, reqUrl, headers, undefined, body);
    }

    /**
     * return httpClient.makeRequest(httpMethod, reqUrl, body, headers, params );
     */
    async sendRequest(httpMethod, reqUrl, headers, params, body) {

        try {
            if (params) {
                if ('source' in params) {
                    return cipzApiGetPriceZoneUpdateMockData.data;
                }
                return cipzApiGetSubmittedRequestMockResponse.data;
            } else {
                return cipzApiRespnseToApproveRequestMockData;
            }

        } catch (e) {
            const errorMessage = ERROR_IN_FETCHING_CIPZ_API_DATA;
            const errorCode = CIPZ_API_DATA_FETCH_ERROR_CODE;
            logger.error(`${errorMessage} due to: ${e}, stacktrace: ${e.stack}`);
            throw new CipzApiDataFetchException(e, errorMessage, errorCode,);
        }
    }

}

export default new PriceZoneReassignmentService();
