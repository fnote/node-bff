/**
 * HttpClient Exception unit tests
 *
 * @author: cwic0864 on 10/07/20
 * */

import ProductInfoDataFetchException from '../productInfoDataFetchException';

const exception = 'Internal Error';
const errorMessage = 'Error Message';

describe('ProductInfoDataFetch Exception', () => {
    test('should return -1 as the error status when the error doesnt have a error message', async () => {
        const productInfoDataFetchException = new ProductInfoDataFetchException(
            exception,
        );
        expect(productInfoDataFetchException.getStatus()).toEqual(-1);
    });

    test('should return the status that provided in the error', async () => {
        const productInfoDataFetchException = new ProductInfoDataFetchException(
            exception, errorMessage,
        );
        expect(productInfoDataFetchException.getStatus()).toEqual(errorMessage);
    });
});
