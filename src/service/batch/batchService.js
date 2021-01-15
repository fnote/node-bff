/**
 * Batch service class
 *
 * @author: gkar5861 on 19/06/20
 * */
import logger from '../../util/logger';
import {httpClient} from '../../httpClient/httpClient';
import {HTTP_DELETE, HTTP_GET, HTTP_POST} from '../../util/constants';
import getBatchAPIConfigs from '../../config/configs';

class BatchService {
    constructor() {
        this.config = getBatchAPIConfigs();
    }

    async generateFileUploadSignedUrl(requestBody) {
        const request = {
            fileNames: requestBody.fileNames,
            contentType: requestBody.contentType,
            userId: requestBody.userId,
            authorizedBunitList: requestBody.authorizedBunitList,
        };
        const url = this.config.api.getInputSignedUrl;
        const response = await httpClient.makeRequest(HTTP_POST, url, request);
        logger.debug(`Generated file upload signed urls response: ${response}`);
        return response;
    }

    async generateFileDownloadSignedUrl(requestBody) {
        const request = {
            fileNames: requestBody.fileNames,
            userId: requestBody.userId,
        };
        const url = this.config.api.getOutputSignedUrl;
        const response = await httpClient.makeRequest(HTTP_POST, url, request);
        logger.debug(`Generated file download signed urls response:: ${response}`);
        return response;
    }

    async getBatchJobs(userId, queryParamsString) {
        let url = `${this.config.api.batchBaseUrl}${userId}${this.config.api.jobRoute}`;
        if (queryParamsString) {
            url = url.concat(queryParamsString);
        }
        const response = await httpClient.makeRequest(HTTP_GET, url);
        logger.debug(`Generated list job details response:: ${response}`);
        return response;
    }

    async deleteJob(userId, jobId) {
        const url = `${this.config.api.batchBaseUrl}${userId}${this.config.api.jobRouteWithPathDelimiter}${jobId}`;
        const response = await httpClient.makeRequest(HTTP_DELETE, url);
        logger.debug(`Generated delete batch job response:: ${response}`);
        return response;
    }
}

export default new BatchService();
