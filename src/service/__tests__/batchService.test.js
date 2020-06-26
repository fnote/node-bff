/**
 * Batch Service unit tests
 *
 * @author: gkar5861 on 22/06/20
 * */
import * as HttpStatus from 'http-status-codes';
import BatchService from '../batch/batchService';
import InvalidRequestException from '../../exception/invalidRequestException';
import {ERROR_IN_GETTING_S3_OUTPUT_SIGNED_URL_UNSUPPORTED_REQUEST_BODY} from '../../util/constants';

jest.mock('../../httpClient/httpClient');

const mockRequestBody = {
    fileNames: [
        'fileName1',
        'fileName2',
    ],
};

const mockResponse = {
    data: [
        {
            fileName: 'fileName1',
            putUrl: 'https://batch-output.s3.amazonaws.com/fileName1?AWSAccessKeyId=ASIAQRLXWZJ',
        },
        {
            fileName: 'fileName2',
            putUrl: 'https://batch-output.s3.amazonaws.com/fileName2?AWSAccessKeyId=ASIAQRLXWZJ',
        },
    ],
};

describe('Batch Service', () => {
    test('should generate input signed urls  when the request body is valid', async () => {
        const response = await BatchService.generateInputSignUrl(mockRequestBody);
        expect(response).toEqual(mockResponse);
    });

    test('should generate output signed urls when the request body is valid', async () => {
        const response = await BatchService.generateOutputSignUrl(mockRequestBody);
        expect(response).toEqual(mockResponse);
    });

    test('should throw exception  when the request body is empty', async () => {
        const emptyRequestBody = {};
        await expect(BatchService.generateInputSignUrl(emptyRequestBody)).rejects
            .toThrowError(new InvalidRequestException(
                ERROR_IN_GETTING_S3_OUTPUT_SIGNED_URL_UNSUPPORTED_REQUEST_BODY,
                HttpStatus.BAD_REQUEST,
            ));
    });

    test('should throw exception  when the request body is invalid', async () => {
        const invalidRequestBody = {filenames: ''};
        await expect(BatchService.generateInputSignUrl(invalidRequestBody)).rejects
            .toThrowError(new InvalidRequestException(
                ERROR_IN_GETTING_S3_OUTPUT_SIGNED_URL_UNSUPPORTED_REQUEST_BODY,
                HttpStatus.BAD_REQUEST,
            ));
    });
});
