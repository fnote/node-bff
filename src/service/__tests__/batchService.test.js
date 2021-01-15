/**
 * Batch Service unit tests
 *
 * @author: gkar5861 on 22/06/20
 * */
import * as HttpStatus from 'http-status-codes';
import BatchService from '../batch/batchService';
import InvalidRequestException from '../../exception/invalidRequestException';
import {UNSUPPORTED_REQUEST_BODY} from '../../util/constants';
import {
    mockBatchApiInputUrlRequest,
    mockBatchApiOutputUrlRequest,
    mockErrorResponse,
    mockErrorResponseFromS3,
    mockResponseFileList,
    mockResponseSignedUrl
} from "../../config/test.config";

jest.mock('../../httpClient/httpClient');



describe('Batch Service', () => {
    test('should generate input signed urls  when the request body is valid', async () => {
        const response = await BatchService.generateFileUploadSignedUrl(mockBatchApiInputUrlRequest);
        expect(response).toEqual(mockResponseSignedUrl);
    });

    test('should generate output signed urls when the request body is valid', async () => {
        const response = await BatchService.generateFileDownloadSignedUrl(mockBatchApiOutputUrlRequest);
        expect(response).toEqual(mockResponseSignedUrl);
    });

    test('should throw exception  when the request body is empty', async () => {
        const emptyRequestBody = {};
        await expect(BatchService.generateFileUploadSignedUrl(emptyRequestBody)).rejects
            .toThrowError(new InvalidRequestException(
                UNSUPPORTED_REQUEST_BODY,
                HttpStatus.BAD_REQUEST,
            ));
    });

    test('should throw exception  when the request body is invalid', async () => {
        const invalidRequestBody = {};
        await expect(BatchService.generateFileUploadSignedUrl(invalidRequestBody)).rejects
            .toThrowError(new InvalidRequestException(
                UNSUPPORTED_REQUEST_BODY,
                HttpStatus.BAD_REQUEST,
            ));
    });

    test('should generate list of files  when the source is valid', async () => {
        const response = await BatchService.getBatchJobs('test1234', 'pageSize=,offSet="",searchQuery=""');
        expect(response).toEqual(mockResponseFileList);
    });

    test('should delete files  when the pass the file list', async () => {
        const response = await BatchService.deleteJob('test1234', '11112222');
        expect(response).toEqual(mockResponseSignedUrl);
    });

    test('should rename the file minor error file to original name', async () => {
        const response = await BatchService.filePreprocessing(mockErrorResponseFromS3);
        expect(response).toEqual(mockErrorResponse);
    });

});
