/**
 * Auth Service unit tests
 *
 * @author: adis0892 on 24/07/20
 * */


import AuthService, {unauthenticatedReturn} from "../auth/authService";
import {getAuthConfig} from "../../config/configs";
import jwkToPem from "jwk-to-pem";
import fetch from "node-fetch";
import * as jwt from "jsonwebtoken";
import {jest} from "@jest/globals";



jest.mock('node-fetch');
jest.mock('jwk-to-pem');
jest.mock('jsonwebtoken');

const authConfig = getAuthConfig();
const tokenName = authConfig.CONFIG.authTokenHeaderAttribute

const mockRequest = {
    headers: {
        [tokenName]: 'access-token',
}
};

const mockRequestWithoutToken = {
    headers: {
    }
};

let mockResponse = {
    end: function(){},
    status: function() {
        return {send: function () {

        }}
    }
};

const authenticatedMockResponse = {
    "authenticated": true,
    "username": "username"
};

jest.mock('../../config/configs', () => ({ getAuthConfig: ()=> {
    return {
        CONFIG: {
            authTokenHeaderAttribute: 'x-amzn-oidc-accesstoken',
                authTokenIssuer: 'testIssuer'
        }
    }}

    } ))

const resolvedValue = {

    keys: [
        {
            'kid': 'kid1',
            'n': 1,
            'e': 1,
            'kty': 1
        },
        {
            'kid': 'kid2',
            'n': 2,
            'e': 2,
            'kty': 2
        }
    ]


}

fetch.mockResolvedValue({ json: async () => Promise.resolve(resolvedValue)});

jwkToPem.mockReturnValueOnce('pems2')
    .mockReturnValueOnce('pems1')


describe('Auth Service', () => {
    test('should generate the authenticated output when a valid token is given', async () => {

        jwt.decode.mockReturnValue({
            payload : {
                iss: 'testIssuer',
                token_use: 'access',
            },
            header: {
                kid: 'kid2'
            }
        });

        const payload = {
            sub: 'principal-id-001',
            username: 'AD_username'
        };

        jwt.verify.mockImplementation((obj, pems, param, callback) => {
            callback(null, payload);
        });


        const response = await AuthService.prepareToValidateToken(mockRequest, mockResponse);
        expect(response).toEqual(authenticatedMockResponse);
    });

    test('header not present', async () => {
        const response = await AuthService.prepareToValidateToken(mockRequestWithoutToken, mockResponse);
        expect(response).toEqual(unauthenticatedReturn);
    });

    test('decoded token empty', async () => {
        jwt.decode.mockReturnValue(null);
        const response = await AuthService.prepareToValidateToken(mockRequest, mockResponse);
        expect(response).toEqual(unauthenticatedReturn);
    });

    test('wrong issuer', async () => {
        jwt.decode.mockReturnValue({
            payload : {
                iss: 'wrongIssuer',
                token_use: 'access',
            },
            header: {
                kid: 'kid2'
            }
        });

        const response = await AuthService.prepareToValidateToken(mockRequest, mockResponse);
        expect(response).toEqual(unauthenticatedReturn);
    });

    test('wrong access', async () => {
        jwt.decode.mockReturnValue({
            payload : {
                iss: 'testIssuer',
                token_use: 'wrong-access',
            },
            header: {
                kid: 'kid2'
            }
        });

        const response = await AuthService.prepareToValidateToken(mockRequest, mockResponse);
        expect(response).toEqual(unauthenticatedReturn);
    });

    test('no matching pem for the kid', async () => {
        jwt.decode.mockReturnValue({
            payload : {
                iss: 'testIssuer',
                token_use: 'access',
            },
            header: {
                kid: 'different-kid'
            }
        });

        const response = await AuthService.prepareToValidateToken(mockRequest, mockResponse);
        expect(response).toEqual(unauthenticatedReturn);
    });

    test('jwt verify gives an error', async () => {
        jwt.decode.mockReturnValue({
            payload : {
                iss: 'testIssuer',
                token_use: 'access',
            },
            header: {
                kid: 'kid2'
            }
        });

        const error = 'verification failed';


        jwt.verify.mockImplementation((obj, pems, param, callback) => {
            callback(error, null);
        });

        const response = await AuthService.prepareToValidateToken(mockRequest, mockResponse);
        expect(response).toEqual(unauthenticatedReturn);
    });

    test('principal id not present', async () => {
        jwt.decode.mockReturnValue({
            payload : {
                iss: 'testIssuer',
                token_use: 'access',
            },
            header: {
                kid: 'kid2'
            }
        });

        const payload = {
            username: 'AD_username'
        };

        jwt.verify.mockImplementation((obj, pems, param, callback) => {
            callback(null, payload);
        });

        const response = await AuthService.prepareToValidateToken(mockRequest, mockResponse);
        expect(response).toEqual(unauthenticatedReturn);
    });

    test('username not present', async () => {
        jwt.decode.mockReturnValue({
            payload : {
                iss: 'testIssuer',
                token_use: 'access',
            },
            header: {
                kid: 'kid2'
            }
        });

        const payload = {
            sub: 'principal-id-001'
        };

        jwt.verify.mockImplementation((obj, pems, param, callback) => {
            callback(null, payload);
        });

        const response = await AuthService.prepareToValidateToken(mockRequest, mockResponse);
        expect(response).toEqual(unauthenticatedReturn);
    });

    test('username not in the expected format', async () => {
        jwt.decode.mockReturnValue({
            payload : {
                iss: 'testIssuer',
                token_use: 'access',
            },
            header: {
                kid: 'kid2'
            }
        });

        const payload = {
            sub: 'principal-id-001',
            username: 'username'
        };

        jwt.verify.mockImplementation((obj, pems, param, callback) => {
            callback(null, payload);
        });

        const response = await AuthService.prepareToValidateToken(mockRequest, mockResponse);
        expect(response).toEqual(unauthenticatedReturn);
    });

    test('throw an error', async () => {
        jwt.decode.mockReturnValue({
            payload : {
                iss: 'testIssuer',
                token_use: 'access',
            },
            header: {
                kid: 'kid2'
            }
        });

        const payload = {
            sub: 'principal-id-001',
            username: 'AD_username'
        };

        jwt.verify.mockImplementation((obj, pems, param, callback) => {
            throw new Error('test-error');
        });


        const response = await AuthService.prepareToValidateToken(mockRequest, mockResponse);
        expect(response).toEqual(unauthenticatedReturn);
    });

});
