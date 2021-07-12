import {
    cipzApiGetSubmittedRequestMockResponse,
    cipzApiGetPriceZoneUpdateMockData,
    cipzApiRespnseToApproveRequestMockData,
    mockCreatePriceZoneUpdateResponse,
} from '../../config/test.config.pzreassignment';

import {HTTP_GET, HTTP_POST, HTTP_PATCH} from '../../util/constants';

class HttpClient {
    async makeRequest({method, reqUrl}) {
        if (reqUrl.includes('/v1/cipz/pz-update-requests') && method === HTTP_POST) {
            return mockCreatePriceZoneUpdateResponse;
        }
        if (reqUrl.includes('/v1/cipz/pz-update-requests') && method === HTTP_GET) {
            return cipzApiGetSubmittedRequestMockResponse;
        }
        if (reqUrl.includes('/v1/cipz/price-zone-updates/33') && method === HTTP_GET) {
            return cipzApiGetPriceZoneUpdateMockData;
        }
        if (reqUrl.includes('/v1/cipz/pz-update-requests') && method === HTTP_PATCH) {
            return cipzApiRespnseToApproveRequestMockData;
        }
    }
}

export default HttpClient;
export const httpClient = new HttpClient();
