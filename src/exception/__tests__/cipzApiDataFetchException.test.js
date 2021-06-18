import * as HttpStatus from 'http-status-codes';
import CipzApiDataFetchException from '../cipzApiDataFetchException';

describe('CipzApiDataFetchException', () => {
    test('should return -1 as the error status when the error doesnt have a response body', async () => {
        const cipzApiDataFetchException = new CipzApiDataFetchException('error');
        expect(cipzApiDataFetchException.message).toEqual('error');
        expect(cipzApiDataFetchException.getStatus()).toEqual(-1);
    });

    test('should return the status that provided in the error', async () => {
        const cipzApiDataFetchException = new CipzApiDataFetchException('error', HttpStatus.BAD_REQUEST);
        expect(cipzApiDataFetchException.message).toEqual('error');
        expect(cipzApiDataFetchException.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
    });
});
