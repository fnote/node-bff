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
    mockErrorResponse, mockErrorResponseFromS3,
    mockRequestSignedUrl,
    mockResponseFileList,
    mockResponseSignedUrl
} from "../../config/test.config";

jest.mock('../../httpClient/httpClient');



describe('Batch Service', () => {
    test('should generate input signed urls  when the request body is valid', async () => {
        const response = await BatchService.generateInputSignUrl(mockRequestSignedUrl);
        expect(response).toEqual(mockResponseSignedUrl);
    });

    test('should generate output signed urls when the request body is valid', async () => {
        const response = await BatchService.generateOutputSignUrl(mockRequestSignedUrl);
        expect(response).toEqual(mockResponseSignedUrl);
    });

    test('should throw exception  when the request body is empty', async () => {
        const emptyRequestBody = {};
        await expect(BatchService.generateInputSignUrl(emptyRequestBody)).rejects
            .toThrowError(new InvalidRequestException(
                UNSUPPORTED_REQUEST_BODY,
                HttpStatus.BAD_REQUEST,
            ));
    });

    test('should throw exception  when the request body is invalid', async () => {
        const invalidRequestBody = {filenames: ''};
        await expect(BatchService.generateInputSignUrl(invalidRequestBody)).rejects
            .toThrowError(new InvalidRequestException(
                UNSUPPORTED_REQUEST_BODY,
                HttpStatus.BAD_REQUEST,
            ));
    });

    test('should generate list of files  when the source is valid', async () => {
        const response = await BatchService.getFiles("output");
        expect(response).toEqual(mockResponseFileList);
    });

    test('should generate list of files  when the source is valid and prefix is given', async () => {
        const response = await BatchService.getFilesByPrefix("output", "REV");
        expect(response).toEqual(mockResponseFileList);
    });

    test('should delete files  when the pass the file list', async () => {
        const response = await BatchService.deleteFiles("output", mockRequestSignedUrl);
        expect(response).toEqual(mockResponseSignedUrl);
    });

    test('should rename the file minor error file to original name', async () => {
        const response = await BatchService.filePreprocessing(mockErrorResponseFromS3);
        expect(response).toEqual(mockErrorResponse);
    });

});
