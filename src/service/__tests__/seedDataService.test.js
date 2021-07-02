 import {jest} from '@jest/globals';
 import seedService from '../seed/seedService';
 import {seedGetItemAttributeGroupMockResponse} from '../../config/test.config.pzreassignment';
 import SeedApiDataFetchException from '../../exception/seedApiDataFechException';
 import { CIPZ_SEED_VALIDATION_AND_GENERAL_ERROR_CODES } from '../../exception/exceptionCodes';

 jest.mock('../../httpClient/PZRHttpClient');
 jest.mock('../../util/accessTokenGenerator');

 describe('Seed API Data Service', () => {
     test('should generate the correct response when flow is correct', async () => {
         const response = await seedService.getSeedItemAttributeGroupsData();
         expect(response.data).toEqual(seedGetItemAttributeGroupMockResponse.data);
     });

     test('should generate the error response', async () => {
        const response = new SeedApiDataFetchException('Test Error',
         'Error', CIPZ_SEED_VALIDATION_AND_GENERAL_ERROR_CODES.SEED_API_ITEM_ATT_GROUP_FETCH_ERROR_CODE);
        expect(response.getStatus()).toEqual('Error');
    });

    test('should generate the error response', async () => {
        const response = new SeedApiDataFetchException('Test Error',
         null, CIPZ_SEED_VALIDATION_AND_GENERAL_ERROR_CODES.SEED_API_ITEM_ATT_GROUP_FETCH_ERROR_CODE);
        expect(response.getStatus()).toEqual(-1);
    });
 });
