import {getSeedApiConfig} from '../../config/configs';
 import {httpClient} from '../../httpClient/httpClient';
 import logger from '../../util/logger';
 import SeedApiDataFetchException from '../../exception/seedApiDataFechException';
 import { getCorrelationId } from '../../util/correlationIdGenerator';
 import {
     HTTP_GET, ERROR_IN_FETCHING_SEED_DATA,
     APPLICATION_JSON, CORRELATION_ID_HEADER,
 } from '../../util/constants';
 
 class SeedDataService {
     constructor() {
         this.seedApiConfig = getSeedApiConfig();
     }
 
     async getSeedItemAttributeGroupsData() {
         
         const headers = {
             'Content-type': APPLICATION_JSON,
             Accept: APPLICATION_JSON,
             clientID: this.seedApiConfig.CONFIG.clientId,
             [CORRELATION_ID_HEADER]: getCorrelationId(),
             BearerAuth : '1234'

         };
 
         const reqUrl = this.seedApiConfig.CONFIG.seedApiUrl 
         + this.seedApiConfig.CONFIG.getItemAttributeGroupsEndpoint;
         return this.sendGetRequest(reqUrl, headers);
     }
 
    
     async sendGetRequest(reqUrl, headers) {
         try {
             return (
                 {
                     attributeGroups:[
                   {
                      name:"MILK",
                      id:12213
                   },
                   {
                      name:"FOOD STORAGE BAGS/SANDWICH BAGS/PAN LINERS",
                      id:16892
                   },
                   {
                      name:"FROZEN PASTA",
                      id:12341
                   }
                ]}
                );
            //return await httpClient.makeRequest(HTTP_GET, reqUrl, undefined, headers);
         } catch (e) {
             const specificErrorMessage = e.errorDetails.response.data.message;
             const errorMessage = `${ERROR_IN_FETCHING_SEED_DATA}, ${specificErrorMessage}`;
             logger.error(`${errorMessage} ${reqUrl} due to: ${e}, stacktrace: ${e.stack}`);
             const seedErrorCode = e.errorDetails.response.data.code;
             throw new SeedApiDataFetchException(
                 errorMessage,
                 e.message,
                 seedErrorCode,
             );
         }
     }
 }
 
 export default new SeedDataService();
 