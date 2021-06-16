import {getCIPZApiConfig} from '../../config/configs';
 import logger from '../../util/logger';
 import CipzApiDataFetchException from '../../exception/cipzApiDataFetchException';
 import { getCorrelationId } from '../../util/correlationIdGenerator';
 import {
    ERROR_IN_FETCHING_CIPZ_API_SUBMITTED_REQUEST_DATA,
     APPLICATION_JSON, CORRELATION_ID_HEADER,
 } from '../../util/constants';
 import { CIPZ_API_SUBMITTED_REQ_ERROR_CODE } from '../../exception/exceptionCodes';
 import { cipzApiGetSubmittedRequestMockResponse } from '../cipzMockData';

 class PriceZoneReassignmentService {

     constructor() {
         this.CipzConfig = getCIPZApiConfig();
     }

     async getCIPZSubmittedRequestData(query) {

        const pageNumber = query.page;
        const requestSubmitter = query.submitter;
        const reqStatus = query.req_status;

         const headers = {
             'Content-type': APPLICATION_JSON,
             Accept: APPLICATION_JSON,
             clientID: this.CipzConfig.CONFIG.clientId,
             [CORRELATION_ID_HEADER]: getCorrelationId(),
         };

         const reqUrl = this.CipzConfig.CONFIG.cipzApiBaseUrl +
          this.CipzConfig.CONFIG.getSubmittedRequestEndpoint;
         return this.sendGetRequest(reqUrl, headers, pageNumber, requestSubmitter, reqStatus);
     }

     /**
      * return httpClient.makeRequest(HTTP_GET, reqUrl, undefined, headers,
      * {offset: (offset*limit), limit: limit, request_submitter: requestSubmitter, request_status: reqStatus } );
      */
     async sendGetRequest(reqUrl, headers, pageNumber, requestSubmitter, reqStatus) {

         try {
             const limit = this.CipzConfig.CONFIG.pageSizeForSubmittedRequest;
             const offset = (Number(pageNumber) - 1)*limit;

             logger.info(`url : ${reqUrl}, headers :${headers}, offset: ${offset},
              limit: ${limit}, requestSubmitter: ${requestSubmitter}, requestStatus: ${reqStatus}`);
             return cipzApiGetSubmittedRequestMockResponse.data;

         } catch (e) {
            const errorMessage = ERROR_IN_FETCHING_CIPZ_API_SUBMITTED_REQUEST_DATA;
            logger.error(`${errorMessage} due to: ${e}, stacktrace: ${e.stack}`);
             throw new CipzApiDataFetchException(e, errorMessage, CIPZ_API_SUBMITTED_REQ_ERROR_CODE,);
         }
     }
 }

 export default new PriceZoneReassignmentService();
