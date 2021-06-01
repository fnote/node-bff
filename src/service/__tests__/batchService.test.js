/**
 * Batch Service unit tests
 *
 * @author: gkar5861 on 22/06/20
 * */
import BatchService from '../batch/batchService';
import {
    mockBatchApiDownloadUrlRequest,
    mockBatchApiUploadUrlRequest,
    mockResponseDeleteJob,
    mockResponseJobList,
    mockResponseSignedUrl,
} from '../../config/test.config';

jest.mock('../../httpClient/httpClient');

describe('Batch Service', () => {
    test('generateFileUploadSignedUrl should generate write signed urls  when the request body is valid', async () => {
        const response = await BatchService.generateFileUploadSignedUrl(mockBatchApiUploadUrlRequest);
        expect(response).toEqual(mockResponseSignedUrl);
    });

    test('generateFileDownloadSignedUrl should generate read signed urls when the request body is valid', async () => {
        const response = await BatchService.generateFileDownloadSignedUrl(mockBatchApiDownloadUrlRequest);
        expect(response).toEqual(mockResponseSignedUrl);
    });

    test('getBatchJobs should generate list of files  when the source is valid', async () => {
        const response = await BatchService.getBatchJobs('test1234', '?pageSize=10&offSet=10');
        expect(response).toEqual(mockResponseJobList);
    });

    test('should delete files  when the pass the file list', async () => {
        const response = await BatchService.deleteJob('test1234', '11112222');
        expect(response).toEqual(mockResponseDeleteJob);
    });
});
