/**
 * Auth routes unit tests
 *
 * @author: adis0892 on 28/07/20
 * */

jest.mock('../../../middleware/authMiddleware');
let {authMiddleware} = require('../../../middleware/authMiddleware');

import request from 'supertest';
import * as HttpStatus from 'http-status-codes';
import {jest} from '@jest/globals';
import app from '../../../app';

const userDetailsMockResponse = {
    "authorizedBunitList": [
        "001",
        "002",
    ],
    "email": "firstName.secondName@syscolabs.com",
    "firstName": "firstName",
    "jobTitle": "jobTitle",
    "lastName": "secondName",
    "username": "username"
}

jest.mock('../../../initializer', () => ({
    initializer: (req, res, next) => next(),
}));

const mockRequest = {};

describe('routes: /auth', () => {
    test('get /login should redirect the user when authentication happens', async () => {
        authMiddleware.mockImplementationOnce((req, res, next) => {
            res.locals.authResponse = {
                "authenticated": true,
                "cause": null,
            }
            next()
        });

        await request(app.app)
            .get('/v1/pci-bff/auth/login')
            .send(mockRequest)
            .set('Accept', 'application/json')
            .then((res) => {
                expect(res.status).toEqual(HttpStatus.MOVED_TEMPORARILY);
            });
    });

    test('get /login should redirect the user when authentication happens even when authenticate: false', async () => {

        authMiddleware.mockImplementationOnce((req, res, next) => {
            res.locals.authResponse = {
                "authenticated": false,
                "cause": null,
                "username": "username",
            }
            next()

        });

        await request(app.app)
            .get('/v1/pci-bff/auth/login')
            .send(mockRequest)
            .set('Accept', 'application/json')
            .then((res) => {
                expect(res.status).toEqual(HttpStatus.MOVED_TEMPORARILY);
            });
    });

    test('get /logout should redirect user to the screen after logout', async () => {
        authMiddleware.mockImplementationOnce((req, res, next) => {
            res.locals.authResponse = {
                "authenticated": true,
                "cause": null,
            }
            next()

        });

        await request(app.app)
            .get('/v1/pci-bff/auth/logout')
            .send(mockRequest)
            .set('Accept', 'application/json')
            .then((res) => {
                const {location} = res.headers;
                expect(res.status).toEqual(HttpStatus.MOVED_TEMPORARILY);
                expect(location).toEqual(expect.stringMatching('logout_uri='));
            });
    });

    test('get /user-details should send successful response when auth response is successful', async () => {

        authMiddleware.mockImplementationOnce((req, res, next) => {
            res.locals.authResponse = {
                "authenticated": true,
                "cause": null,
                "username": "username",
                "userDetailsData": {
                    "authorizedBunitList": [
                        "001",
                        "002",
                    ],
                    "email": "firstName.secondName@syscolabs.com",
                    "firstName": "firstName",
                    "jobTitle": "jobTitle",
                    "lastName": "secondName",
                    "username": "username"
                },
            }
            next()

        });

        await request(app.app)
            .get('/v1/pci-bff/auth/user-details')
            .send(mockRequest)
            .set('Accept', 'application/json')
            .then((res) => {
                expect(res.status).toEqual(HttpStatus.OK);
                expect(res.body).toEqual(userDetailsMockResponse);
            });
    });

    test('get /user-details should send unauthorized response when auth response send "authenticated": false', async () => {

        authMiddleware.mockImplementationOnce((req, res, next) => {
            res.locals.authResponse = {
                "authenticated": false,
                "cause": null,
                "username": "username",
            }
            next()

        });

        const errorResponse = {
            "message": "User cannot be authenticated",
            "status": "Unauthorized",
        }

        await request(app.app)
            .get('/v1/pci-bff/auth/user-details')
            .send(mockRequest)
            .set('Accept', 'application/json')
            .then((res) => {
                expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
                expect(res.body).toEqual(errorResponse);
            });
    });

    test('get /user-details should send unauthorized response when auth response send userDetailsData empty', async () => {

        authMiddleware.mockImplementationOnce((req, res, next) => {
            res.locals.authResponse = {
                "authenticated": true,
                "cause": null,
                "username": "username",
                "userDetailsData": {},
            }
            next()

        });

        const errorResponse = {
            "cause": "User details are not present",
            "message": "User cannot be authenticated",
            "status": "Unauthorized",
        }

        await request(app.app)
            .get('/v1/pci-bff/auth/user-details')
            .send(mockRequest)
            .set('Accept', 'application/json')
            .then((res) => {
                expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
                expect(res.body).toEqual(errorResponse);
            });
    });

    test('get /user-details should send unauthorized response when auth response send userDetailsData is not defined', async () => {

        authMiddleware.mockImplementationOnce((req, res, next) => {
            res.locals.authResponse = {
                "authenticated": true,
                "cause": null,
                "username": "username",
            }
            next()

        });

        const errorResponse = {
            "cause": "User details are not present",
            "message": "User cannot be authenticated",
            "status": "Unauthorized",
        }

        await request(app.app)
            .get('/v1/pci-bff/auth/user-details')
            .send(mockRequest)
            .set('Accept', 'application/json')
            .then((res) => {
                expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
                expect(res.body).toEqual(errorResponse);
            });
    });
});
