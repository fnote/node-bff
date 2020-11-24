/**
 * Batch service class
 *
 * @author: gkar5861 on 19/06/20
 * */
import logger from '../../util/logger';
import {httpClient} from '../../httpClient/httpClient';
import {HTTP_DELETE, HTTP_GET, HTTP_POST, URL_SEPARATOR} from '../../util/constants';
import getBatchAPIConfigs from '../../config/configs';
import {validateRequestBody, validateSource} from '../../validator/validateRequest';

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

    async getFiles(source) {
        validateSource(source);
        const url = `${this.config.api.batchBaseUrl}${source}`;
        const response = await httpClient.makeRequest(HTTP_GET, url);
        logger.debug(`Generated file list response:: ${response}`);
        return response;
    }

    async getFilesByPrefix(source, prefix) {
        validateSource(source);
        const url = `${this.config.api.batchBaseUrl}${source}${URL_SEPARATOR}${prefix}`;
        const response = await httpClient.makeRequest(HTTP_GET, url);
        logger.debug(`Generated file list by prefix:: ${response}`);
        return response;
    }

    async deleteFiles(source, requestBody) {
        validateSource(source);
        validateRequestBody(requestBody);
        const request = {
            fileNames: requestBody.fileNames,
        };
        const url = `${this.config.api.batchBaseUrl}${source}`;
        const response = await httpClient.makeRequest(HTTP_DELETE, url, request);
        logger.debug(`Generated deleted file list response:: ${response}`);
        return response;
    }
}

export default new BatchService();
