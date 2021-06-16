import {getCIPZApiConfig} from '../../config/configs';
 import logger from '../../util/logger';
 import CipzApiDataFetchException from '../../exception/cipzApiDataFetchException';
 import { getCorrelationId } from '../../util/correlationIdGenerator';
 import {
    ERROR_IN_FETCHING_CIPZ_API_SUBMITTED_REQUEST_DATA,
    ERROR_IN_PAGINATING_CIPZ_API_SUBMITTED_REQUEST_DATA,
     APPLICATION_JSON, CORRELATION_ID_HEADER,
 } from '../../util/constants';
 import { CIPZ_API_SUBMITTED_REQ_ERROR_CODE } from '../../exception/exceptionCodes';
 import { cipzApiGetSubmittedRequestMockResponse } from '../cipzMockData';


 class PriceZoneReassignmentService {

     constructor() {
         this.CipzConfig = getCIPZApiConfig();
     }

     async getCIPZSubmittedRequestData(pageNumber) {


         const headers = {
             'Content-type': APPLICATION_JSON,
             Accept: APPLICATION_JSON,
             clientID: this.CipzConfig.CONFIG.clientId,
             [CORRELATION_ID_HEADER]: getCorrelationId(),
         };

         const reqUrl = this.CipzConfig.CONFIG.cipzApiBaseUrl +
          this.CipzConfig.CONFIG.getSubmittedRequestEndpoint;
         return this.sendGetRequest(reqUrl, headers, pageNumber);
     }

     async sendGetRequest(reqUrl, headers, pageNumber) {

         try {
             const pageSize  =  this.CipzConfig.CONFIG.pageSizeForSubmittedRequest;
             const response = {}
             response.data = await this.paginate(cipzApiGetSubmittedRequestMockResponse.data.data.pzUpdateRequests, pageSize, pageNumber);
             response.numberOfPages = Math.ceil(cipzApiGetSubmittedRequestMockResponse.data.data.pzUpdateRequests.length / pageSize);
             return response;
         } catch (e) {
            const errorMessage = ERROR_IN_FETCHING_CIPZ_API_SUBMITTED_REQUEST_DATA;
            logger.error(`${errorMessage} due to: ${e}, stacktrace: ${e.stack}`);
             throw new CipzApiDataFetchException(e, errorMessage, CIPZ_API_SUBMITTED_REQ_ERROR_CODE,);
         }
     }

     async paginate(array, page_size, page_number) {
         try {
             return array.slice((page_number - 1) * page_size, page_number * page_size);
         } catch (e) {
            const errorMessage = ERROR_IN_PAGINATING_CIPZ_API_SUBMITTED_REQUEST_DATA;
            logger.error(`${errorMessage} due to: ${e}, stacktrace: ${e.stack}`);
             throw new CipzApiDataFetchException(e, errorMessage, CIPZ_API_SUBMITTED_REQ_ERROR_CODE,);

         }
    }
 }

 export default new PriceZoneReassignmentService();
