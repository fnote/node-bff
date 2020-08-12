/**
 * Auth routes unit tests
 *
 * @author: adis0892 on 28/07/20
 * */

import request from 'supertest';
import * as HttpStatus from 'http-status-codes';
import {jest} from '@jest/globals';
import {app} from '../../../app';

jest.mock('../../../middleware/authMiddleware', () => ({
    authMiddleware: (req, res, next) => next(),
}));
jest.mock('../../../initializer', () => ({
    initializer: (req, res, next) => next(),
}));

const mockRequest = {};

describe('routes: /auth', () => {
    test('get /login should redirect the user when authentication happens', async () => {
        await request(app)
            .get('/v1/pci-bff/auth/login')
            .send(mockRequest)
            .set('Accept', 'application/json')
            .then((res) => {
                    expect(res.status).toEqual(HttpStatus.MOVED_TEMPORARILY);
                });
    });

    test('get /logout should redirect user to the screen after logout', async () => {
        await request(app)
            .get('/v1/pci-bff/auth/logout')
            .send(mockRequest)
            .set('Accept', 'application/json')
            .then((res) => {
                    const {location} = res.headers;
                    expect(res.status).toEqual(HttpStatus.MOVED_TEMPORARILY);
                    expect(location).toEqual(expect.stringMatching('logout_uri='));
                });
    });
});
