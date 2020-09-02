/**
 * Auth middleware unit tests
 *
 * @author: adis0892 on 26/07/20
 * */

import {jest} from '@jest/globals';
import {authMiddleware} from '../authMiddleware';
import {AUTHENTICATION_NOT_REQUIRED_HEALTH_CHECK} from '../../util/constants';

jest.mock('../../service/auth/authService', () => ({
    prepareToValidateToken: () => ({
            authenticated: true,
            username: 'test-username',
        }),
}));

let req = {};
const res = {
    locals: {},
};
const next = jest.fn();

describe('Auth Middleware', () => {
    test('should pass the username and call next when auth process completed', async () => {
        await authMiddleware(req, res, next);

        expect(res.locals.authResponse.username).toEqual('test-username');
        expect(next).toHaveBeenCalled();
    });

    test('should skip authentication when healthcheck endpoint is called', async () => {
        req = {
            url: AUTHENTICATION_NOT_REQUIRED_HEALTH_CHECK,
        };

        await authMiddleware(req, res, next);

        expect(next).toHaveBeenCalled();
    });
});
