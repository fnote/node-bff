 import request from 'supertest';
 import * as HttpStatus from 'http-status-codes';
 import {jest} from '@jest/globals';
 import app from '../../../app';
 import {
    seedGetItemAttributeGroupMockResponse,
 } from '../../../config/test.config';

 jest.mock('../../../httpClient/httpClient');
 jest.mock('../../../util/accessTokenGenerator');
 
 jest.mock('../../../initializer', () => ({
     initializer: (req, res, next) => next(),
 }));

 jest.mock('../../../middleware/authMiddleware');
 const {authMiddleware} = require('../../../middleware/authMiddleware');

 describe('routes: /item-attribute-groups', () => {
     test('get/item-attribute-groups should return correct response with HTTP OK when the flow is correct', async () => {

        authMiddleware.mockImplementationOnce((req, res, next) => {
            res.locals.authResponse = {
                authenticated: true,
                cause: null,
                username: 'username',
                userDetailsData: {
                    authorizedPricingTransformationEnabledBunitList: ['019'],
                    authorizedBatchEnabledBunitList: ['001', '002'],
                    email: 'firstName.secondName@syscolabs.com',
                    firstName: 'firstName',
                    jobTitle: 'jobTitle',
                    lastName: 'secondName',
                    username: 'test1234',
                },
            };
            next();
        });

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

describe('routes: /item-attribute-groups', () => {

    test('get/item-attribute-groups should return error response when it is not authorized', async () => {

        authMiddleware.mockImplementationOnce((req, res, next) => {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .send(createErrorResponse(null, errMessage, error, null));
        });

        jest.setTimeout(100000);
        await request(app.app)
            .get('/v1/pci-bff/price-zone-reassignment/item-attribute-groups')
            .set('Accept', 'application/json')
            .then((res) => {
                expect(res.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
            });
    });
});
