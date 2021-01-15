/**
 * Auth Service unit tests
 *
 * @author: adis0892 on 24/07/20
 * */

import jwkToPem from 'jwk-to-pem';
import * as jwt from 'jsonwebtoken';
import {jest} from '@jest/globals';
import {getAuthConfig} from '../../config/configs';
import AuthenticateService from '../auth/authenticateService';

jest.mock('../../httpClient/httpClient');
jest.mock('jwk-to-pem');
jest.mock('jsonwebtoken');

const authConfig = getAuthConfig();
const tokenName = authConfig.CONFIG.authTokenHeaderAttribute;
const userClaim = authConfig.CONFIG.userClaimHeaderAttribute;

const mockRequest = {
    headers: {
        [tokenName]: 'access-token',
        [userClaim]: 'user-claim-first.second',
    },
};

const mockRequestWithoutToken = {
    headers: {},
};

const mockResponse = {
    end() {
    },
    status() {
        return {
            send() {

            },
        };
    },
};

const authorizedPricingTransformationEnabledBunitList = [
    {
        bunit_id: '001',
        bunit_name: 'Sysco Jackson',
        periscope_on: 'Y',
    },
    {
        bunit_id: '003',
        bunit_name: 'Sysco Jacksonville',
        periscope_on: 'Y',
    },
];
const authorizedBatchEnabledBunitList = ['001', '002'];

const authenticatedMockResponse = {
    authenticated: true,
    cause: null,
    username: 'username',
    userDetailsData: {
        authorizedPricingTransformationEnabledBunitList,
        authorizedBatchEnabledBunitList,
        email: 'firstName.secondName@syscolabs.com',
        firstName: 'firstName',
        jobTitle: 'jobTitle',
        lastName: 'secondName',
        username: 'username',
        role: 'appadmin',
    },
};

jest.mock('../../config/configs', () => ({
    getAuthConfig: () => ({
        CONFIG: {
            authTokenHeaderAttribute: 'x-amzn-oidc-accesstoken',
            userClaimHeaderAttribute: 'x-amzn-oidc-data',
            authTokenIssuer: 'testIssuer',
            jwkRequestUrl: 'https://cognito-idp.us-east-1.amazonaws.com/local/.well-known/jwks.json',
        },
    }),

}));

jest.mock('../auth/authorizationService', () => ({
    getAuthorizedBusinessUnits: () => ({
        authorizedPricingTransformationEnabledBunitList: [
            {
                bunit_id: '001',
                bunit_name: 'Sysco Jackson',
                periscope_on: 'Y',
            },
            {
                bunit_id: '003',
                bunit_name: 'Sysco Jacksonville',
                periscope_on: 'Y',
            },
        ],
        authorizedBatchEnabledBunitList: ['001', '002'],
    }),

}));

JSON.parse = jest.fn().mockImplementation(() => ({
    username: 'AD_username',
    profile: 'appadmin',
    locale: '341 - Sysco Labs',
    given_name: 'firstName',
    family_name: 'secondName',
    email: 'firstName.secondName@syscolabs.com',
    zoneinfo: 'jobTitle',
}));

jwkToPem.mockReturnValueOnce('pems2')
    .mockReturnValueOnce('pems1');

describe('Auth Service', () => {
    test('should generate the authenticated output when a valid token is given', async () => {
        jwt.decode.mockReturnValue({
            payload: {
                iss: 'testIssuer',
                token_use: 'access',
            },
            header: {
                kid: 'kid2',
            },
        });

        const payload = {
            sub: 'principal-id-001',
            username: 'AD_username',
        };

        jwt.verify.mockImplementation((obj, pems, param, callback) => {
            callback(null, payload);
        });

        const response = await AuthenticateService.prepareToValidateToken(mockRequest, mockResponse);
        expect(response).toEqual(authenticatedMockResponse);
    });

    test('should return unauthenticated response when auth token header is not present', async () => {
        const response = await AuthenticateService
            .prepareToValidateToken(mockRequestWithoutToken, mockResponse);
        const unauthenticatedReturn = {
            authenticated: false,
            cause: 'Access token is missing from header',
            username: null,
        };
        expect(response).toEqual(unauthenticatedReturn);
    });

    test('should return unauthenticated response when decoded token is empty', async () => {
        jwt.decode.mockReturnValue(null);
        const response = await AuthenticateService.prepareToValidateToken(mockRequest, mockResponse);
        const unauthenticatedReturn = {
            authenticated: false,
            cause: 'Not a valid JWT token',
            username: null,
        };
        expect(response).toEqual(unauthenticatedReturn);
    });

    test('wrong issuer', async () => {
        jwt.decode.mockReturnValue({
            payload: {
                iss: 'wrongIssuer',
                token_use: 'access',
            },
            header: {
                kid: 'kid2',
            },
        });

        const response = await AuthenticateService.prepareToValidateToken(mockRequest, mockResponse);
        const unauthenticatedReturn = {
            authenticated: false,
            cause: 'The issuer of the token is invalid',
            username: null,
        };
        expect(response).toEqual(unauthenticatedReturn);
    });

    test('should return unauthenticated response when wrong access is given in the token', async () => {
        jwt.decode.mockReturnValue({
            payload: {
                iss: 'testIssuer',
                token_use: 'wrong-access',
            },
            header: {
                kid: 'kid2',
            },
        });

        const response = await AuthenticateService.prepareToValidateToken(mockRequest, mockResponse);
        const unauthenticatedReturn = {
            authenticated: false,
            cause: 'Token is not an access token',
            username: null,
        };
        expect(response).toEqual(unauthenticatedReturn);
    });

    test('should return unauthenticated response when no matching pem for the kid is found', async () => {
        jwt.decode.mockReturnValue({
            payload: {
                iss: 'testIssuer',
                token_use: 'access',
            },
            header: {
                kid: 'different-kid',
            },
        });

        const response = await AuthenticateService.prepareToValidateToken(mockRequest, mockResponse);
        const unauthenticatedReturn = {
            authenticated: false,
            cause: 'Invalid access token',
            username: null,
        };
        expect(response).toEqual(unauthenticatedReturn);
    });

    test('should return unauthenticated response when jwt verify gives an error', async () => {
        jwt.decode.mockReturnValue({
            payload: {
                iss: 'testIssuer',
                token_use: 'access',
            },
            header: {
                kid: 'kid2',
            },
        });

        const error = 'verification failed';

        jwt.verify.mockImplementation((obj, pems, param, callback) => {
            callback(error, null);
        });

        const response = await AuthenticateService.prepareToValidateToken(mockRequest, mockResponse);
        const unauthenticatedReturn = {
            authenticated: false,
            cause: 'Token was failed to be verified',
            username: null,
        };
        expect(response).toEqual(unauthenticatedReturn);
    });

    test('should return unauthenticated response when principal id is not present', async () => {
        jwt.decode.mockReturnValue({
            payload: {
                iss: 'testIssuer',
                token_use: 'access',
            },
            header: {
                kid: 'kid2',
            },
        });

        const payload = {
            username: 'AD_username',
        };

        jwt.verify.mockImplementation((obj, pems, param, callback) => {
            callback(null, payload);
        });

        const response = await AuthenticateService.prepareToValidateToken(mockRequest, mockResponse);
        const unauthenticatedReturn = {
            authenticated: false,
            cause: 'Required variables for authentication are invalid',
            username: null,
        };
        expect(response).toEqual(unauthenticatedReturn);
    });

    test('should return unauthenticated response when an an error is thrown', async () => {
        jwt.decode.mockReturnValue({
            payload: {
                iss: 'testIssuer',
                token_use: 'access',
            },
            header: {
                kid: 'kid2',
            },
        });

        jwt.verify.mockImplementation(() => {
            throw new Error('test-error');
        });

        const response = await AuthenticateService.prepareToValidateToken(mockRequest, mockResponse);
        const unauthenticatedReturn = {
            authenticated: false,
            cause: 'Unexpected error occurred while validating the token',
            username: null,
        };
        expect(response).toEqual(unauthenticatedReturn);
    });

    test('should generate the empty business unit lists when token parsed opco is Nan', async () => {
        JSON.parse = jest.fn().mockImplementationOnce(() => ({
            username: 'AD_username',
            profile: 'appadmin',
            locale: ' - Sysco Labs',
            given_name: 'firstName',
            family_name: 'secondName',
            email: 'firstName.secondName@syscolabs.com',
            zoneinfo: 'jobTitle',
        }));
        jwt.decode.mockReturnValue({
            payload: {
                iss: 'testIssuer',
                token_use: 'access',
            },
            header: {
                kid: 'kid2',
            },
        });

        const payload = {
            sub: 'principal-id-001',
            username: 'AD_username',
        };

        jwt.verify.mockImplementation((obj, pems, param, callback) => {
            callback(null, payload);
        });

        const authenticatedResponseWithEmptyBunits = {
            authenticated: true,
            cause: null,
            username: 'username',
            userDetailsData: {
                authorizedPricingTransformationEnabledBunitList: [],
                authorizedBatchEnabledBunitList: [],
                email: 'firstName.secondName@syscolabs.com',
                firstName: 'firstName',
                jobTitle: 'jobTitle',
                lastName: 'secondName',
                username: 'username',
                role: undefined,
            },
        };
        const response = await AuthenticateService.prepareToValidateToken(mockRequest, mockResponse);
        expect(response).toEqual(authenticatedResponseWithEmptyBunits);
    });

    test('should generate unauthorizedResponse when token parsed opco is null', async () => {
        JSON.parse = jest.fn().mockImplementationOnce(() => ({
            username: 'AD_username',
            profile: 'appadmin',
            locale: null,
            given_name: 'firstName',
            family_name: 'secondName',
            email: 'firstName.secondName@syscolabs.com',
            zoneinfo: 'jobTitle',
        }));
        jwt.decode.mockReturnValue({
            payload: {
                iss: 'testIssuer',
                token_use: 'access',
            },
            header: {
                kid: 'kid2',
            },
        });

        const payload = {
            sub: 'principal-id-001',
            username: 'AD_username',
        };

        jwt.verify.mockImplementation((obj, pems, param, callback) => {
            callback(null, payload);
        });

        const unauthenticatedReturn = {
            authenticated: false,
            cause: 'Authorized OPCO given in the authentication token is invalid',
            username: null,
        };
        const response = await AuthenticateService.prepareToValidateToken(mockRequest, mockResponse);
        expect(response).toEqual(unauthenticatedReturn);
    });

    test('should generate unauthorizedResponse when token parsed username is empty', async () => {
        JSON.parse = jest.fn().mockImplementationOnce(() => ({
            username: '',
            profile: 'appadmin',
            locale: '341 - Sysco Labs',
            given_name: 'firstName',
            family_name: 'secondName',
            email: 'firstName.secondName@syscolabs.com',
            zoneinfo: 'jobTitle',
        }));
        jwt.decode.mockReturnValue({
            payload: {
                iss: 'testIssuer',
                token_use: 'access',
            },
            header: {
                kid: 'kid2',
            },
        });

        const payload = {
            sub: 'principal-id-001',
            username: 'AD_username',
        };

        jwt.verify.mockImplementation((obj, pems, param, callback) => {
            callback(null, payload);
        });

        const unauthenticatedReturn = {
            authenticated: false,
            cause: 'Username is not present in the auth token',
            username: null,
        };
        const response = await AuthenticateService.prepareToValidateToken(mockRequest, mockResponse);
        expect(response).toEqual(unauthenticatedReturn);
    });

    test('should generate unauthorizedResponse when token parsed username is not valid', async () => {
        JSON.parse = jest.fn().mockImplementationOnce(() => ({
            username: 'username',
            profile: 'appadmin',
            locale: '341 - Sysco Labs',
            given_name: 'firstName',
            family_name: 'secondName',
            email: 'firstName.secondName@syscolabs.com',
            zoneinfo: 'jobTitle',
        }));
        jwt.decode.mockReturnValue({
            payload: {
                iss: 'testIssuer',
                token_use: 'access',
            },
            header: {
                kid: 'kid2',
            },
        });

        const payload = {
            sub: 'principal-id-001',
            username: 'AD_username',
        };

        jwt.verify.mockImplementation((obj, pems, param, callback) => {
            callback(null, payload);
        });

        const unauthenticatedReturn = {
            authenticated: false,
            cause: 'Username given in the authentication token is invalid',
            username: null,
        };
        const response = await AuthenticateService.prepareToValidateToken(mockRequest, mockResponse);
        expect(response).toEqual(unauthenticatedReturn);
    });

    test('should generate authenticated with high profile when more user roles are passed', async () => {
        JSON.parse = jest.fn().mockImplementationOnce(() => ({
            username: 'AD_username',
            profile: '[appadmin, generaluser]',
            locale: '341 - Sysco Labs',
            given_name: 'firstName',
            family_name: 'secondName',
            email: 'firstName.secondName@syscolabs.com',
            zoneinfo: 'jobTitle',
        }));
        jwt.decode.mockReturnValue({
            payload: {
                iss: 'testIssuer',
                token_use: 'access',
            },
            header: {
                kid: 'kid2',
            },
        });

        const payload = {
            sub: 'principal-id-001',
            username: 'AD_username',
        };

        jwt.verify.mockImplementation((obj, pems, param, callback) => {
            callback(null, payload);
        });

        const authenticatedMockResponseWithHighProfile = {
            authenticated: true,
            cause: null,
            username: 'username',
            userDetailsData: {
                authorizedPricingTransformationEnabledBunitList,
                authorizedBatchEnabledBunitList,
                email: 'firstName.secondName@syscolabs.com',
                firstName: 'firstName',
                jobTitle: 'jobTitle',
                lastName: 'secondName',
                username: 'username',
                role: '[appadmin, generaluser]',
            },
        };

        const response = await AuthenticateService.prepareToValidateToken(mockRequest, mockResponse);
        expect(response).toEqual(authenticatedMockResponseWithHighProfile);
    });
});
