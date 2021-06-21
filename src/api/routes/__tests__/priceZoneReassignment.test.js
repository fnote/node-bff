import request from 'supertest';
import * as HttpStatus from 'http-status-codes';
import {describe, jest} from '@jest/globals';
import app from '../../../app';
import { createErrorResponse } from '../../../mapper/responseMapper';
import AuthorizationService from '../../../service/auth/authorizationService';
import SeedDataService from '../../../service/seed/seedDataService';
import SeedApiDataFetchException from '../../../exception/seedApiDataFechException';
import PriceZoneReassignmentService from '../../../service/priceZoneReassignment/priceZoneReassignmentService';
import {mockPzUpdateRequestBody} from '../../../config/test.config.pzreassignment';

jest.mock('../../../httpClient/httpClient');
jest.mock('../../../util/accessTokenGenerator');

jest.mock('../../../initializer', () => ({
    initializer: (req, res, next) => next(),
}));

jest.mock('../../../middleware/authMiddleware');
const {authMiddleware} = require('../../../middleware/authMiddleware');

const executeAuthMiddlewareMockImplementation = () => {
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
};

describe('routes: /item-attribute-groups', () => {
    test('get/item-attribute-groups should return correct response with HTTP OK when the flow is correct', async () => {
    executeAuthMiddlewareMockImplementation();

        jest.setTimeout(100000);
        await request(app.app)
            .get('/v1/pci-bff/price-zone-reassignment/item-attribute-groups')
            .set('Accept', 'application/json')
            .then((res) => {
                expect(res.status).toEqual(HttpStatus.OK);
            });
    });

    test('get/item-attribute-groups should return error response when error occured in auth', async () => {
        authMiddleware.mockImplementationOnce((req, res, next) => {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .send(createErrorResponse(null, 'Test Error Message', 'test error', null));
        });

        jest.setTimeout(100000);
        await request(app.app)
            .get('/v1/pci-bff/price-zone-reassignment/item-attribute-groups')
            .set('Accept', 'application/json')
            .then((res) => {
                expect(res.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
            });
    });

    test('get/item-attribute-groups should return error response when it is not authorized', async () => {
        executeAuthMiddlewareMockImplementation();
        jest.spyOn(AuthorizationService, 'isAuthorizedRequest').mockReturnValue(false);

        jest.setTimeout(100000);
        await request(app.app)
            .get('/v1/pci-bff/price-zone-reassignment/item-attribute-groups')
            .set('Accept', 'application/json')
            .then((res) => {
                expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
            });
    });

    test('get/item-attribute-groups should catch error when error occured in seed data fetching', async () => {
        executeAuthMiddlewareMockImplementation();
        jest.spyOn(AuthorizationService, 'isAuthorizedRequest').mockReturnValue(true);
        jest.spyOn(SeedDataService, 'getSeedItemAttributeGroupsData').mockImplementation(() => {
            throw new SeedApiDataFetchException('Test Error', 'Test Error Msg', 'Test Error Code');
        });

        jest.setTimeout(100000);
        await request(app.app)
            .get('/v1/pci-bff/price-zone-reassignment/item-attribute-groups')
            .set('Accept', 'application/json')
            .then((res) => {
                expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
            });
    });

    test('get/item-attribute-groups should throw internal error when an unknown error occured in seed data fetching', async () => {
        executeAuthMiddlewareMockImplementation();
        jest.spyOn(AuthorizationService, 'isAuthorizedRequest').mockReturnValue(true);
        jest.spyOn(SeedDataService, 'getSeedItemAttributeGroupsData').mockImplementation(() => {
            throw new Error('Test Error Msg');
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

describe('routes: /pz-update-requests', () => {
    test('get/pz-update-requests should return correct response with HTTP OK when the flow is correct', async () => {
        executeAuthMiddlewareMockImplementation();
        jest.setTimeout(100000);
        await request(app.app)
            .get('/v1/pci-bff/price-zone-reassignment/pz-update-requests?limit=20&request_status=PENDING_APPROVAL&offset=2')
            .set('Accept', 'application/json')
            .then((res) => {
                expect(res.status).toEqual(HttpStatus.OK);
            });
    });

    test('get/pz-update-requests should return error response when it is not authorized', async () => {
        executeAuthMiddlewareMockImplementation();
        jest.spyOn(AuthorizationService, 'isAuthorizedRequest').mockReturnValue(false);

        jest.setTimeout(100000);
        await request(app.app)
            .get('/v1/pci-bff/price-zone-reassignment/pz-update-requests?limit=20&request_status=PENDING_APPROVAL&offset=2')
            .set('Accept', 'application/json')
            .then((res) => {
                expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
            });
    });

    test('get/pz-update-requests should catch error when error occured in seed data fetching', async () => {
        executeAuthMiddlewareMockImplementation();
        jest.spyOn(AuthorizationService, 'isAuthorizedRequest').mockReturnValue(true);
        jest.spyOn(PriceZoneReassignmentService, 'getCIPZSubmittedRequestData').mockImplementation(() => {
            throw new SeedApiDataFetchException('Test Error', 'Test Error Msg', 'Test Error Code');
        });

        jest.setTimeout(100000);
        await request(app.app)
            .get('/v1/pci-bff/price-zone-reassignment/pz-update-requests?limit=20&request_status=PENDING_APPROVAL&offset=2')
            .set('Accept', 'application/json')
            .then((res) => {
                expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
            });
    });
});

describe('routes: /pz-updates/:request_id', () => {
    test('get/pz-updates/:request_id should return correct response with HTTP OK when the flow is correct', async () => {
        executeAuthMiddlewareMockImplementation();
        jest.setTimeout(100000);
        await request(app.app)
            .get('/v1/pci-bff/price-zone-reassignment/pz-updates/33?source=USER_SUBMISSION&limit=10&offset=20')
            .set('Accept', 'application/json')
            .then((res) => {
                expect(res.status).toEqual(HttpStatus.OK);
            });
    });

    test('get/pz-updates/:request_id should return error response when it is not authorized', async () => {
            executeAuthMiddlewareMockImplementation();
        jest.spyOn(AuthorizationService, 'isAuthorizedRequest').mockReturnValue(false);

        jest.setTimeout(100000);
        await request(app.app)
            .get('/v1/pci-bff/price-zone-reassignment/pz-updates/33?source=USER_SUBMISSION&limit=10&offset=20')
            .set('Accept', 'application/json')
            .then((res) => {
                expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
            });
    });

    test('get/pz-updates/:request_id should catch error when error occured in seed data fetching', async () => {
        executeAuthMiddlewareMockImplementation();
        jest.spyOn(AuthorizationService, 'isAuthorizedRequest').mockReturnValue(true);
        jest.spyOn(PriceZoneReassignmentService, 'getPriceZoneUpdatesData').mockImplementation(() => {
            throw new SeedApiDataFetchException('Test Error', 'Test Error Msg', 'Test Error Code');
        });

        jest.setTimeout(100000);
        await request(app.app)
            .get('/v1/pci-bff/price-zone-reassignment/pz-updates/33?source=USER_SUBMISSION&limit=10&offset=20')
            .set('Accept', 'application/json')
            .then((res) => {
                expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
            });
    });
});

describe('routes: /pz-update-requests', () => {
    test('patch /pz-update-requests:request_id should return correct response with HTTP OK when the flow is correct', async () => {
        executeAuthMiddlewareMockImplementation();
        jest.setTimeout(100000);
        await request(app.app)
            .patch('/v1/pci-bff/price-zone-reassignment/pz-update-requests')
            .set('Accept', 'application/json')
            .send(mockPzUpdateRequestBody)
            .then((res) => {
                expect(res.status).toEqual(HttpStatus.OK);
            });
    });

    test('patch /pz-update-requests should return error response when it is not authorized', async () => {
        executeAuthMiddlewareMockImplementation();
        jest.spyOn(AuthorizationService, 'isAuthorizedRequest').mockReturnValue(false);

        jest.setTimeout(100000);
        await request(app.app)
            .patch('/v1/pci-bff/price-zone-reassignment/pz-update-requests')
            .set('Accept', 'application/json')
            .send(mockPzUpdateRequestBody)
            .then((res) => {
                expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
            });
    });

    test('patch /pz-update-requests should catch error when error occured in seed data fetching', async () => {
        executeAuthMiddlewareMockImplementation();
        jest.spyOn(AuthorizationService, 'isAuthorizedRequest').mockReturnValue(true);
        jest.spyOn(PriceZoneReassignmentService, 'approveRejectApprovalRequest').mockImplementation(() => {
            throw new SeedApiDataFetchException('Test Error', 'Test Error Msg', 'Test Error Code');
        });

        jest.setTimeout(100000);
        await request(app.app)
            .patch('/v1/pci-bff/price-zone-reassignment/pz-update-requests')
            .set('Accept', 'application/json')
            .send(mockPzUpdateRequestBody)
            .then((res) => {
                expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
            });
    });
});
