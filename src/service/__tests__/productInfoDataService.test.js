/**
 * Product info Service unit tests
 *
 * @author: cwic0864 on 10/08/20
 * */

import {jest} from '@jest/globals';
import ProductInfoService from '../productInfo/productInfoService';
import {
    productInfoMockResponse,
} from '../../config/test.config';
import ProductInfoDataFetchException from '../../exception/productInfoDataFetchException';

jest.mock('../../httpClient/httpClient');
jest.mock('../../util/accessTokenGenerator');

describe('Cloud Pricing Data Service', () => {
    test('should generate the correct response when flow is correct', async () => {
        const response = await ProductInfoService
            .getProductInfo('068', '7203474');
        expect(response).toEqual(productInfoMockResponse);
    });

    test('should throw an exception when product http call include invalid data', async () => {
        try {
            await ProductInfoService
                .getProductInfo('999', 9999999);
        } catch (e) {
            expect(e.name).toEqual(ProductInfoDataFetchException.name);
            expect(e.getStatus()).toEqual('Failed to fetch data from Product Info API');
        }
    });
});
