/**
 * Customer info Service unit tests
 *
 * @author: sthe3935 on 10/08/20
 * */

import {jest} from '@jest/globals';
import CustomerInfoService from '../customerInfo/customerInfoService';
import { customerInfoMockResponse } from '../../config/test.config';
import CustomerInfoDataFetchException from '../../exception/customerInfoDataFetchException';

jest.mock('../../httpClient/httpClient');
jest.mock('../../util/accessTokenGenerator');

describe('Cloud Pricing Data Service', () => {
    test('should generate the correct response when flow is correct', async () => {
        const response = await CustomerInfoService
            .getCustomerInfo('019', '622548');
        expect(response).toEqual(customerInfoMockResponse);
    });

    test('should throw an exception when product http call include invalid data', async () => {
        try {
            await CustomerInfoService
                .getCustomerInfo('999', 9999999);
        } catch (e) {
            expect(e.name).toEqual(CustomerInfoDataFetchException.name);
            expect(e.getStatus()).toEqual('Failed to fetch data from Customer Info API');
        }
    });
});
