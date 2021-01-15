/**
 * Batch Service unit tests
 *
 * @author: gkar5861 on 22/06/20
 * */
import * as HttpStatus from 'http-status-codes';
import BatchService from '../batch/batchService';
import InvalidRequestException from '../../exception/invalidRequestException';
import {INVALID_REQUEST_BODY} from '../../util/constants';
import {
    mockBatchApiDownloadUrlRequest,
    mockBatchApiUploadUrlRequest,
    mockResponseDeleteJob,
    mockResponseJobList,
    mockResponseSignedUrl
} from "../../config/test.config";

jest.mock('../../httpClient/httpClient');



describe('Batch Service', () => {
    test('should generate input signed urls  when the request body is valid', async () => {
        const response = await BatchService.generateFileUploadSignedUrl(mockBatchApiUploadUrlRequest);
        expect(response).toEqual(mockResponseSignedUrl);
    });

    test('should generate output signed urls when the request body is valid', async () => {
        const response = await BatchService.generateFileDownloadSignedUrl(mockBatchApiDownloadUrlRequest);
        expect(response).toEqual(mockResponseSignedUrl);
    });

    test('should throw exception  when the request body is empty', async () => {
        const emptyRequestBody = {};
        await expect(BatchService.generateFileUploadSignedUrl(emptyRequestBody)).rejects
            .toThrowError(new InvalidRequestException(
                INVALID_REQUEST_BODY,
                HttpStatus.BAD_REQUEST,
            ));
    });

    test('should throw exception  when the request body is invalid', async () => {
        const invalidRequestBody = {};
        await expect(BatchService.generateFileUploadSignedUrl(invalidRequestBody)).rejects
            .toThrowError(new InvalidRequestException(
                INVALID_REQUEST_BODY,
                HttpStatus.BAD_REQUEST,
            ));
    });

    test('should generate list of files  when the source is valid', async () => {
        const response = await BatchService.getBatchJobs('test1234', 'pageSize=,offSet="",searchQuery=""');
        expect(response).toEqual(mockResponseJobList);
    });

    test('should delete files  when the pass the file list', async () => {
        const response = await BatchService.deleteJob('test1234', '11112222');
        expect(response).toEqual(mockResponseDeleteJob);
    });

});
