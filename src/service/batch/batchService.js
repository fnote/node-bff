/**
 * Batch service class
 *
 * @author: gkar5861 on 19/06/20
 * */
import logger from '../../util/logger';
import {httpClient} from '../../httpClient/httpClient';
import {
    ERROR_FILE,
    ERROR_FILE_EXTENSION,
    FILE_ERROR,
    FILE_SUCCESS,
    HTTP_DELETE,
    HTTP_GET,
    HTTP_POST,
    URL_SEPARATOR
} from '../../util/constants';
import getBatchAPIConfigs from '../../config/configs';
import {validateRequestBody, validateSource} from '../../validator/validateRequest';

class BatchService {
    constructor() {
        this.config = getBatchAPIConfigs();
    }

    filePreprocessing = (responseData) => {
        let filesWithErrorNames = responseData.data.data ? responseData.data.data : [];

        filesWithErrorNames.forEach((file, index) => {
            file.action = FILE_SUCCESS;
            if (file.fileName.endsWith(ERROR_FILE_EXTENSION)) {
                file.action = FILE_ERROR;
                file.minorErrorFileName = file.fileName;
                const originalFilename = file.fileName.replace(ERROR_FILE_EXTENSION, "")
                file.fileName = file.fileName.replace(ERROR_FILE, "")
                filesWithErrorNames = filesWithErrorNames.filter(otherFile => {
                    return (!otherFile.fileName.startsWith(originalFilename) ||
                        (otherFile.fileName.startsWith(originalFilename) && otherFile.action === FILE_ERROR));
                });
            }
        });

        responseData.data.data = filesWithErrorNames.sort((f1, f2) => new Date(f1.date) - new Date(f2.date));
        return responseData;
    }

    async generateInputSignUrl(requestBody) {
        validateRequestBody(requestBody);
        const request = {
            fileNames: requestBody.fileNames,
            contentType: requestBody.contentType,
            userId: requestBody.userId,
            authorizedBunitList: requestBody.authorizedBunitList
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
            userId: requestBody.userId,
        };
        const url = this.config.api.getOutputSignedUrl;
        const response = await httpClient.makeRequest(HTTP_POST, url, request);
        logger.debug(`Generated output signed urls response:: ${response}`);
        return response;
    }

    async getFiles(source) {
        validateSource(source);
        const url = `${this.config.api.batchBaseUrl}${source}`;
        let response = await httpClient.makeRequest(HTTP_GET, url);
        response = this.filePreprocessing(response);
        logger.debug(`Generated file list response:: ${response}`);
        return response;
    }

    async getFilesByPrefix(source, prefix) {
        validateSource(source);
        const url = `${this.config.api.batchBaseUrl}${source}${URL_SEPARATOR}${prefix}`;
        let response = await httpClient.makeRequest(HTTP_GET, url);
        response = this.filePreprocessing(response);
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
