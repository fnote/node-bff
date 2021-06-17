 import {jest} from '@jest/globals';
 import SeedDataService from '../seed/seedDataService';
 import {seedGetItemAttributeGroupMockResponse} from '../../config/test.config';
 import SeedApiDataFetchException from '../../exception/seedApiDataFechException';
 import { SEED_API_ITEM_ATT_GROUP_FETCH_ERROR_CODE } from '../../exception/exceptionCodes';

 jest.mock('../../httpClient/httpClient');
 jest.mock('../../util/accessTokenGenerator');

 describe('Seed API Data Service', () => {
     test('should generate the correct response when flow is correct', async () => {
         const response = await SeedDataService.getSeedItemAttributeGroupsData();
         expect(response).toEqual(seedGetItemAttributeGroupMockResponse.data);
     });

     test('should generate the error response', async () => {
        const response = new SeedApiDataFetchException('Test Error',
         'Error', SEED_API_ITEM_ATT_GROUP_FETCH_ERROR_CODE);
        expect(response.getStatus()).toEqual('Error');
    });

    test('should generate the error response', async () => {
        const response = new SeedApiDataFetchException('Test Error',
         null, SEED_API_ITEM_ATT_GROUP_FETCH_ERROR_CODE);
        expect(response.getStatus()).toEqual(-1);
    });
 });
