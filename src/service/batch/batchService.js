/**
 * Batch service class
 *
 * @author: gkar5861 on 19/06/20
 * */
import logger from '../../util/logger';
import {httpClient} from '../../httpClient/httpClient';
import {HTTP_POST} from '../../util/constants';
import getBatchAPIConfigs from '../../config/configs';
import validateRequestBody from '../../validator/validateRequestBody';

class BatchService {
    constructor() {
        this.config = getBatchAPIConfigs();
    }

    async generateInputSignUrl(requestBody) {
        validateRequestBody(requestBody);
        const request = {
            fileNames: requestBody.fileNames,
        };
        const url = this.config.api.getInputSignedUrl;
        const response = await httpClient.makeRequest(HTTP_POST, url, request);
        logger.debug(`Generated input signed urls response: ${response}`);
        return response;
    }

    async generateOutputSignUrl(requestBody) {
        validateRequestBody(requestBody);
        const request = {
            fileNames: requestBody.fileNames,
        };
        const url = this.config.api.getOutputSignedUrl;
        const response = await httpClient.makeRequest(HTTP_POST, url, request);
        logger.debug(`Generated output signed urls response:: ${response}`);
        return response;
    }
}

export default new BatchService();
