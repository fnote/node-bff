 import {jest} from '@jest/globals';
 import SeedDataService from '../seed/seedDataService';
 import {seedGetItemAttributeGroupMockResponse} from '../../config/test.config';
 
 jest.mock('../../httpClient/httpClient');
 jest.mock('../../util/accessTokenGenerator');
 
 describe('Seed API Data Service', () => {
     test('should generate the correct response when flow is correct', async () => {
         const response = await SeedDataService.getSeedItemAttributeGroupsData();
         expect(response).toEqual(seedGetItemAttributeGroupMockResponse.data);
     });
 });
 