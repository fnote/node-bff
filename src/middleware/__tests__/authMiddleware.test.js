import * as HttpStatus from 'http-status-codes';
import {jest} from '@jest/globals';
import httpMocks from 'node-mocks-http';
import {authMiddleware} from '../authMiddleware';
import {AUTHENTICATION_NOT_REQUIRED_HEALTH_CHECK, LOGIN_URL, LOGOUT_URL} from '../../util/constants';
import AuthenticateService from '../../service/auth/authenticateService';

/**
 * Auth middleware unit tests
 *
 * @author: adis0892 on 26/07/20
 * */
jest.mock('../../service/auth/authenticateService');

beforeEach(() => {
    jest.clearAllMocks();
});

let request = {};
const response = {
    locals: {},
    body: {},
    status: (code) => ({
        send: (message) => ({code, message}),
    }),
};
const next = jest.fn();

describe('Auth Middleware', () => {
    test('should pass the username and call next when auth process completed', async () => {
        await AuthenticateService.prepareToValidateToken.mockImplementationOnce(() => ({
                authenticated: true,
                username: 'test-username',
            }));

        await authMiddleware(request, response, next);

        expect(response.locals.authResponse.username).toEqual('test-username');
        expect(next).toHaveBeenCalled();
    });

    test('should skip authentication when healthcheck endpoint is called', async () => {
        request = {
            url: AUTHENTICATION_NOT_REQUIRED_HEALTH_CHECK,
        };

        await authMiddleware(request, response, next);

        expect(next).toHaveBeenCalled();
    });

    test('should skip authentication when logout endpoint is called', async () => {
        request = {
            url: LOGOUT_URL,
        };

        await authMiddleware(request, response, next);

        expect(next).toHaveBeenCalled();
    });

    test('should skip authentication when login endpoint is called', async () => {
        await AuthenticateService.prepareToValidateToken.mockImplementationOnce(() => ({
                authenticated: true,
                username: 'test-username',
            }));

        request = {
            url: LOGIN_URL,
        };

        await authMiddleware(request, response, next);

        expect(response.locals.authResponse.username).toEqual('test-username');
        expect(next).toHaveBeenCalled();
    });

    test('should give unauthorized http response status when not login endpoint is called and authenticate: false',
        async () => {
            await AuthenticateService.prepareToValidateToken.mockImplementationOnce(() => ({
                authenticated: false,
                username: 'test-username',
            }));

            const req = httpMocks.createRequest();
            const res = httpMocks.createResponse();

            await authMiddleware(req, res, next);

            expect(res.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
        });

    test('should send internal server error http status when prepareToValidateToken method throw an error', async () => {
        const req = httpMocks.createRequest();
        const res = httpMocks.createResponse();

        await AuthenticateService.prepareToValidateToken.mockImplementationOnce(() => {
                throw Error('test-error');
            });

        await authMiddleware(req, res, next);

        expect(res.statusCode).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    });
});
