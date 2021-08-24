import {httpClient} from '../../httpClient/PZRHttpClient';
import {getCIPZApiConfig} from '../../config/configs';
import CipzApiDataFetchException from '../../exception/cipzApiDataFetchException';
import {getCorrelationId} from '../../util/correlationIdGenerator';
// constants
import {
    APPLICATION_JSON, CORRELATION_ID_HEADER,
    HTTP_GET,
    HTTP_PATCH,
    HTTP_POST,
    GENERIC_CIPZ_API_ERROR_MESSAGE, UNKNOWN_CIPZ_API_ERROR_MESSAGE, CLOUD_PCI_CLIENT_ID,
} from '../../util/constants';
import {UNKNOWN_CIPZ_API_ERROR, UNKNOWN_CIPZ_API_CAUGHT_ERROR} from '../../exception/exceptionCodes';

class PriceZoneReassignmentService {
    constructor() {
        this.CipzConfig = getCIPZApiConfig();
    }

    static constructHeaders() {
        return ({
            'Content-type': APPLICATION_JSON,
            Accept: APPLICATION_JSON,
            'client-id': CLOUD_PCI_CLIENT_ID,
            [CORRELATION_ID_HEADER]: getCorrelationId(),
        });
    }

    static handleError(error) {
        if (error && error.response && error.response.data) {
            const errorData = error.response.data;
            const errorCode = Number(errorData.code);
            const errorMesssage = errorData.message ? errorData.message : GENERIC_CIPZ_API_ERROR_MESSAGE;
            if (errorCode) {
                throw new CipzApiDataFetchException(error, errorMesssage, errorCode);
            }
            throw new CipzApiDataFetchException(error, UNKNOWN_CIPZ_API_ERROR_MESSAGE, UNKNOWN_CIPZ_API_ERROR);
        }
        throw new CipzApiDataFetchException(error, UNKNOWN_CIPZ_API_ERROR_MESSAGE, UNKNOWN_CIPZ_API_CAUGHT_ERROR);
    }

    async getCIPZSubmittedRequestData(query) {
        const params = {
            limit: query.limit,
            offset: query.offset,
            request_status: query.request_status,
        };

        const headers = PriceZoneReassignmentService.constructHeaders();
        const reqUrl = this.CipzConfig.CONFIG.cipzApiBaseUrl + this.CipzConfig.CONFIG.getSubmittedRequestEndpoint;
        return httpClient.makeRequest({
            method: HTTP_GET,
            reqUrl,
            data: null,
            headers,
            params,
        }).then((response) => response.data).catch((error) => PriceZoneReassignmentService.handleError(error));
    }

    async getPriceZoneUpdatesData(query, requestId) {
        const params = {
            limit: query.limit,
            offset: query.offset,
            source: query.source,
        };

        const headers = PriceZoneReassignmentService.constructHeaders();
        const reqUrl = this.CipzConfig.CONFIG.cipzApiBaseUrl + this.CipzConfig.CONFIG.getPriceZoneUpdateEndpoint + requestId;
        return httpClient.makeRequest({
            method: HTTP_GET,
            reqUrl,
            data: null,
            headers,
            params,
        }).then((response) => response.data).catch((error) => PriceZoneReassignmentService.handleError(error));
    }

    async reviewSubmission(body) {
        const headers = PriceZoneReassignmentService.constructHeaders();
        const reqUrl = this.CipzConfig.CONFIG.cipzApiBaseUrl + this.CipzConfig.CONFIG.patchPriceZoneReviewEndpoint;
        return httpClient.makeRequest({
            method: HTTP_PATCH,
            reqUrl,
            data: body,
            headers,
            params: null,
        }).then((response) => response.data).catch((error) => PriceZoneReassignmentService.handleError(error));
    }

    async createPriceZoneChange(req) {
        const headers = PriceZoneReassignmentService.constructHeaders();
        const reqUrl = this.CipzConfig.CONFIG.cipzApiBaseUrl + this.CipzConfig.CONFIG.createPriceZoneUpdateEndpoint;
        return httpClient.makeRequest({
            method: HTTP_POST,
            reqUrl,
            data: req.body,
            headers,
            params: null,
        }).then((response) => response.data).catch((error) => PriceZoneReassignmentService.handleError(error));
    }
}

export default new PriceZoneReassignmentService();
