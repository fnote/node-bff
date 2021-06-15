import {getSeedApiConfig} from '../../config/configs';
 import logger from '../../util/logger';
 import SeedApiDataFetchException from '../../exception/seedApiDataFechException';
 import { getCorrelationId } from '../../util/correlationIdGenerator';
 import {
     ERROR_IN_FETCHING_SEED_ITEM_ATTRIBUTE_GROUP_DATA,
     APPLICATION_JSON, CORRELATION_ID_HEADER,
 } from '../../util/constants';
 import {getAccessToken} from '../../util/accessTokenGenerator';
 import { SEED_API_ITEM_ATT_GROUP_FETCH_ERROR_CODE } from '../../exception/exceptionCodes';
 import { seedGetItemAttributeGroupMockResponse } from '../cipzMockData';


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
             BearerAuth : await getAccessToken(false)
         };
         const reqUrl = this.seedApiConfig.CONFIG.seedApiBaseUrl +
          this.seedApiConfig.CONFIG.getItemAttributeGroupsEndpoint;
         return this.sendGetRequest(reqUrl, headers);
     }

     async sendGetRequest(reqUrl, headers) {
         try {
             return (seedGetItemAttributeGroupMockResponse.data);
         } catch (e) {
            const errorMessage = ERROR_IN_FETCHING_SEED_ITEM_ATTRIBUTE_GROUP_DATA;
            logger.error(`${errorMessage} due to: ${e}, stacktrace: ${e.stack}`);
             throw new SeedApiDataFetchException(e, errorMessage, SEED_API_ITEM_ATT_GROUP_FETCH_ERROR_CODE,);
         }
     }
 }

 export default new SeedDataService();
