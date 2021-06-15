/**
 * Pricing data routes unit tests
 *
 * @author: adis0892 on 28/07/20
 * */

 import request from 'supertest';
 import * as HttpStatus from 'http-status-codes';
 import {jest} from '@jest/globals';
 import app from '../../../app';
 import {
    seedGetItemAttributeGroupMockResponse,
 } from '../../../config/test.config';

 jest.mock('../../../httpClient/httpClient');
 jest.mock('../../../util/accessTokenGenerator');
 
 jest.mock('../../../middleware/authMiddleware', () => ({
     authMiddleware: (req, res, next) => next(),
 }));
 jest.mock('../../../initializer', () => ({
     initializer: (req, res, next) => next(),
 }));
 
 jest.mock('../../../service/auth/authorizationService', () => ({
     isAuthorizedRequest: () => true,
 }));
 
 describe('routes: /item-attribute-groups', () => {
     test('get/item-attribute-groups should return correct response with HTTP OK when the flow is correct', async () => {
         jest.setTimeout(100000);
         await request(app.app)
             .get('/v1/pci-bff/price-zone-reassignment/item-attribute-groups')
             .set('Accept', 'application/json')
             .then((res) => {
                 expect(res.status).toEqual(HttpStatus.OK);
                 expect(res.body).toBeDefined();
                 expect(res.body).toEqual(seedGetItemAttributeGroupMockResponse.data);
             });
     });
 
 });
 