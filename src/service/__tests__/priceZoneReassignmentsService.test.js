import {jest} from '@jest/globals';
import * as HttpStatus from 'http-status-codes';
import PriceZoneReassignmentService from '../priceZoneReassignment/priceZoneReassignmentService';
import CipzApiDataFetchException from '../../exception/cipzApiDataFetchException';
import InvalidRequestException from '../../exception/invalidRequestException';
import { SEED_API_ITEM_ATT_GROUP_FETCH_ERROR_CODE } from '../../exception/exceptionCodes';

jest.mock('../../httpClient/httpClient');
jest.mock('../../util/accessTokenGenerator');

describe(' Price Zone Reassignment Service - getCIPZSubmittedRequestData', () => {
    test('should generate non null response when flow is correct', async () => {
        const query = {
                limit: 10,
                offset: 20,
                request_status: 'request_status',
        };
        const response = await PriceZoneReassignmentService.getCIPZSubmittedRequestData(query);
        expect(response).not.toBeNull();
    });

    test('should generate the error response when query params are invalid', async () => {
        const query = {
                limit: 10,
                offset: 20,
        };
        try {
            await PriceZoneReassignmentService.getCIPZSubmittedRequestData(query);
        } catch (e) {
            expect(e.name).toEqual(InvalidRequestException.name);
        }
    });

    test('should generate the error response when error occured in creating response', async () => {
        const query = {
                limit: 10,
                offset: 20,
                request_status: 'request_status',
        };
        jest.spyOn(PriceZoneReassignmentService, 'constructHeaders').mockImplementation(() => {
            throw new Error();
        });
        try {
            await PriceZoneReassignmentService.getCIPZSubmittedRequestData(query);
        } catch (e) {
            expect(e.name).toEqual(CipzApiDataFetchException.name);
        }
    });
});

describe(' Price Zone Reassignment Service - getPriceZoneUpdatesData', () => {
    test('should generate non null response when flow is correct', async () => {
        const query = {
                limit: 10,
                offset: 20,
                source: 'test-source',
        };
        jest.spyOn(PriceZoneReassignmentService, 'constructHeaders').mockImplementation(() => ({
                headers: 'mock headers',
            }));
        const reqId = 33;
        const response = await PriceZoneReassignmentService.getPriceZoneUpdatesData(query, reqId);
        expect(response).not.toBeNull();
    });

    test('should generate the error response when query params are invalid', async () => {
        const query = {
                limit: 10,
                offset: 20,
        };
        const reqId = 33;
        try {
            await PriceZoneReassignmentService.getPriceZoneUpdatesData(query, reqId);
        } catch (e) {
            expect(e.name).toEqual(InvalidRequestException.name);
        }
    });

    test('should generate the error response when error occured in creating response', async () => {
        const query = {
                limit: 10,
                offset: 20,
                source: 'test-source',
        };
        const reqId = 33;
        jest.spyOn(PriceZoneReassignmentService, 'constructHeaders').mockImplementation(() => {
            throw new Error();
        });
        try {
            await PriceZoneReassignmentService.getPriceZoneUpdatesData(query, reqId);
        } catch (e) {
            expect(e.name).toEqual(CipzApiDataFetchException.name);
        }
    });
});

describe(' Price Zone Reassignment Service - approveRejectApprovalRequest', () => {
    test('should generate non null response when flow is correct', async () => {
        const body = {
            requestId: 112,
            approver: {
               id: 'sams5625',
               givenName: 'Sanjaya',
               surname: 'Amarasinghe',
               email: 'sams5625@sysco.com',
            },
            status: 'APPROVED',
         };

        jest.spyOn(PriceZoneReassignmentService, 'constructHeaders').mockImplementation(() => ({
                headers: 'mock headers',
            }));

        const response = await PriceZoneReassignmentService.approveRejectApprovalRequest(body);
        expect(response).not.toBeNull();
    });

    test('should generate the error response when body is invalid', async () => {
        const body = {
            requestId: 112,
            approver: {
               id: 'sams5625',
               givenName: 'Sanjaya',
               surname: 'Amarasinghe',
               email: 'sams5625@sysco.com',
            },
         };
        try {
            await PriceZoneReassignmentService.approveRejectApprovalRequest(body);
        } catch (e) {
            expect(e.name).toEqual(InvalidRequestException.name);
        }
    });

    test('should generate the error response when error occured in creating response', async () => {
        const body = {
            requestId: 112,
            approver: {
               id: 'sams5625',
               givenName: 'Sanjaya',
               surname: 'Amarasinghe',
               email: 'sams5625@sysco.com',
            },
            status: 'APPROVED',
         };
        jest.spyOn(PriceZoneReassignmentService, 'constructHeaders').mockImplementation(() => {
            throw new Error();
        });
        try {
            await PriceZoneReassignmentService.approveRejectApprovalRequest(body);
        } catch (e) {
            expect(e.name).toEqual(CipzApiDataFetchException.name);
        }
    });
});
