/**
 * Auth middleware unit tests
 *
 * @author: adis0892 on 26/07/20
 **/

import {authMiddleware} from "../authMiddleware";
import {jest} from "@jest/globals";
import {AUTHENTICATION_NOT_REQUIRED_HEALTH_CHECK} from "../../util/constants";

jest.mock('../../service/auth/authService', () => ({
    prepareToValidateToken: () => {
        return {
            authenticated: true,
            username: 'test-username'
        }
    }
}));

const req = {}
const res = {
    locals: {}
}
const next = jest.fn();

describe('Auth Middleware', () => {
    test('should pass the username and call next when auth process completed', async () => {

        await authMiddleware(req, res, next);

        expect(res.locals.username).toEqual('test-username');
        expect(next).toHaveBeenCalled();
    });

    test('should skip authentication when healthcheck endpoint is called', async () => {
        const req = {
            url: AUTHENTICATION_NOT_REQUIRED_HEALTH_CHECK
        };

        await authMiddleware(req, res, next);

        expect(next).toHaveBeenCalled();
    });
});