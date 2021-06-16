import {getCIPZApiConfig} from '../../config/configs';
 import logger from '../../util/logger';
 import CipzApiDataFetchException from '../../exception/cipzApiDataFetchException';
 import { getCorrelationId } from '../../util/correlationIdGenerator';
 import {
    ERROR_IN_FETCHING_CIPZ_API_DATA,
     APPLICATION_JSON, CORRELATION_ID_HEADER,
 } from '../../util/constants';
 import { CIPZ_API_DATA_FETCH_ERROR_CODE } from '../../exception/exceptionCodes';
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
              limit : query.limit,
              offset: query.offset,
              reqStatus: query.reqStatus
          }

          return this.sendGetRequest(reqUrl, headers, params);
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
              limit : query.limit,
              offset: query.offset,
              source : query.source
          }

          return this.sendGetRequest(reqUrl, headers, params);
     }


     /**
      * return httpClient.makeRequest(HTTP_GET, reqUrl, undefined, headers, params );
      */
     async sendGetRequest(reqUrl, headers, params) {

         try {

             logger.info(`url : ${reqUrl}, headers :${headers}, params: ${params}`);

             if ('source' in params) {
                 return cipzApiGetPriceZoneUpdateMockData.data;
             }
             return cipzApiGetSubmittedRequestMockResponse.data;

         } catch (e) {
            const errorMessage = ERROR_IN_FETCHING_CIPZ_API_DATA;
            const cpizErrorCode = CIPZ_API_DATA_FETCH_ERROR_CODE;
            logger.error(`${errorMessage} due to: ${e}, stacktrace: ${e.stack}`);
             throw new CipzApiDataFetchException(e, errorMessage, cpizErrorCode,);
         }
     }
 }

 export default new PriceZoneReassignmentService();
