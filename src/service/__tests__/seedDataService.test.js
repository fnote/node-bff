import { jest } from '@jest/globals';
import seedService from '../seed/seedService';
import { seedGetItemAttributeGroupMockResponse } from '../../config/test.config.pzreassignment';
import SeedApiDataFetchException from '../../exception/seedApiDataFechException';
import { CIPZ_SEED_VALIDATION_ERROR_CODES } from '../../exception/exceptionCodes';
import apiCentralClient from '../../httpClient/apiCentralClient';

jest.mock('../../httpClient/httpClient');
jest.mock('../../util/accessTokenGenerator');

jest.mock('../../config/configs', () => ({
    getSeedApiBaseUrl: () => 'http://localhost:3000/services/v1/edwp',
    getSeedApiConfig: () => ({
        CONFIG: {
            getItemAttributeGroupsEndpoint: '/attribute-groups',
            getCustomerAndItemAttributeGroupsEndpoint: '/item-price-zone/customer-attribute-group',
            getCustomerGroupAndItemAttributeGroupsEndpoint: '/item-price-zone/customer-group-attribute-group',
            timeout: 0,
        },
    }),
}));

describe('Seed API Data Service', () => {
    test('should generate the correct response when flow is correct', async () => {
        const response = await seedService.getSeedItemAttributeGroupsData();
        expect(response.data).toEqual(seedGetItemAttributeGroupMockResponse.data);
    });

    test('should generate the error response', async () => {
        const response = new SeedApiDataFetchException('Test Error',
            'Error', CIPZ_SEED_VALIDATION_ERROR_CODES.PRICE_ZONE_REASSIGNMENT_INVALID_UPDATE_PAYLOAD_ERROR_CODE);
        expect(response.getStatus()).toEqual('Error');
    });

    test('should generate the error response', async () => {
        const response = new SeedApiDataFetchException('Test Error',
            null, CIPZ_SEED_VALIDATION_ERROR_CODES.PRICE_ZONE_REASSIGNMENT_INVALID_UPDATE_PAYLOAD_ERROR_CODE);
        expect(response.getStatus()).toEqual(-1);
    });

    test('should generate the error response if errorDetails are not present', async () => {
        jest.spyOn(apiCentralClient, 'get').mockImplementation(() => {
            throw new Error();
        });
        try {
            await seedService.getSeedItemAttributeGroupsData();
        } catch (e) {
            expect(e.errorCode).toEqual(5006);
        }
    });

    test('should generate the error response', async () => {
        jest.spyOn(apiCentralClient, 'post').mockImplementation(() => {
            throw new Error();
        });
        try {
            await seedService.getPriceZoneDetailsForCustomerAndItemAttributeGroup('');
        } catch (e) {
            expect(e.errorCode).toEqual(5006);
        }
    });

    test('should generate the error response', async () => {
        jest.spyOn(apiCentralClient, 'post').mockImplementation(() => {
            throw new Error();
        });
        try {
            await seedService.getPriceZoneDetailsForCustomerGroupAndItemAttributeGroup('');
        } catch (e) {
            expect(e.errorCode).toEqual(5006);
        }
    });
 });
