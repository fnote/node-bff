/**
 * HttpClient Exception unit tests
 *
 * @author: sthe3935 on 10/07/20
 * */

import CustomerInfoDataFetchException from '../customerInfoDataFetchException';

const exception = 'Internal Error';
const errorMessage = 'Error Message';

describe('customerInfoDataFetch Exception', () => {
    test('should return -1 as the error status when the error doesnt have a error message', async () => {
        const customerInfoDataFetchException = new CustomerInfoDataFetchException(
            exception,
        );
        expect(customerInfoDataFetchException.getStatus()).toEqual(-1);
    });

    test('should return the status that provided in the error', async () => {
        const customerInfoDataFetchException = new CustomerInfoDataFetchException(
            exception, errorMessage,
        );
        expect(customerInfoDataFetchException.getStatus()).toEqual(errorMessage);
    });
});
