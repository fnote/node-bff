import * as HttpStatus from 'http-status-codes';
import { getCIPZApiConfig } from '../../config/configs';
import logger from '../../util/logger';
import CipzApiDataFetchException from '../../exception/cipzApiDataFetchException';
import { getCorrelationId } from '../../util/correlationIdGenerator';
import {
    ERROR_IN_FETCHING_CIPZ_API_DATA,
    INVALID_REQUEST_BODY,
    INVALID_QUERY_PARAMS,
    APPLICATION_JSON, CORRELATION_ID_HEADER,
    HTTP_GET,
    HTTP_PATCH,
    ERROR_IN_CREATING_CIPZ_PRICE_ZONE_UPDATE,
} from '../../util/constants';
import {
    CIPZ_API_DATA_FETCH_ERROR_CODE,
    CPIZ_API_DATA_INVALID_PAYLOAD_ERROR_CODE,
    CIPZ_API_CREATE_PRICE_ZONE_UPDATE_ERROR_CODE,
    CPIZ_API_DATA_INVALID_QUERY_PARAMS_ERROR_CODE,
} from '../../exception/exceptionCodes';
import InvalidRequestException from '../../exception/invalidRequestException';
import { cipzApprovalRequestReqBody } from '../../validator/schema';
import {
    cipzApiGetSubmittedRequestMockResponse,
    cipzApiGetPriceZoneUpdateMockData,
    cipzApiRespnseToApproveRequestMockData,
    cipzCreatePriceZoneChangeMockResponse,
} from '../cipzMockData';

class PriceZoneReassignmentService {
    constructor() {
        this.CipzConfig = getCIPZApiConfig();
    }

    async constructHeaders() {
        // const accessToken = await getAccessToken(false);
        return ({
            'Content-type': APPLICATION_JSON,
            Accept: APPLICATION_JSON,
            clientID: this.CipzConfig.CONFIG.clientId,
            [CORRELATION_ID_HEADER]: getCorrelationId(),
            // BearerAuth: accessToken,
        });
    }

    async getCIPZSubmittedRequestData(query) {
        let params;
        if (query && query.limit && query.offset && query.request_status) {
            params = {
                limit: query.limit,
                offset: query.offset,
                request_status: query.request_status,
            };
        } else {
            logger.error('Request query params validation failed in getting CIPZ submitted request data.');
            throw new InvalidRequestException(
                INVALID_QUERY_PARAMS,
                HttpStatus.BAD_REQUEST,
                CPIZ_API_DATA_INVALID_QUERY_PARAMS_ERROR_CODE,
            );
        }
        const headers = await this.constructHeaders();
        const reqUrl = this.CipzConfig.CONFIG.cipzApiBaseUrl + this.CipzConfig.CONFIG.getSubmittedRequestEndpoint;
        return this.sendRequest(HTTP_GET, reqUrl, headers, params, undefined);
    }

    async getPriceZoneUpdatesData(query, requestId) {
        let params;
        if (query && query.limit && query.offset && query.source) {
            params = {
                limit: query.limit,
                offset: query.offset,
                source: query.source,
            };
        } else {
            logger.error('Request query params validation failed in getting CIPZ Price Zone update data');
            throw new InvalidRequestException(
                INVALID_QUERY_PARAMS,
                HttpStatus.BAD_REQUEST,
                CPIZ_API_DATA_INVALID_QUERY_PARAMS_ERROR_CODE,
            );
        }
        const headers = await this.constructHeaders();
        const reqUrl = this.CipzConfig.CONFIG.cipzApiBaseUrl + this.CipzConfig.CONFIG.getPriceZoneUpdateEndpoint + requestId;
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
                CPIZ_API_DATA_INVALID_PAYLOAD_ERROR_CODE,
            );
        }
        const headers = await this.constructHeaders();
        const reqUrl = this.CipzConfig.CONFIG.cipzApiBaseUrl
            + this.CipzConfig.CONFIG.patchApproveRejectApprovalReqEndpoint;

        return this.sendRequest(HTTP_PATCH, reqUrl, headers, undefined, body);
    }

    async sendRequest(httpMethod, reqUrl, headers, params, body) {
        try {
            if (params) {
                if ('source' in params) {
                    return cipzApiGetPriceZoneUpdateMockData.data;
                }
                return cipzApiGetSubmittedRequestMockResponse.data;
            }
            return cipzApiRespnseToApproveRequestMockData;
            // return httpClient.makeRequest(httpMethod, reqUrl, body, headers, params );
        } catch (e) {
            const errorMessage = ERROR_IN_FETCHING_CIPZ_API_DATA;
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
