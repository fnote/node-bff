/**
 * Auth Service functions
 *
 * @author: adis0892 on 23/07/20
 * */

import * as jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import logger from '../../util/logger';
import {getAuthConfig} from '../../config/configs';
import {httpClient} from '../../httpClient/httpClient';
import {
    HTTP_GET,
    ROLE_CIPZ,
    ROLE_CIPZ_REVIEWER,
    ROLE_CIPZ_SUBMITTER,
    ROLE_REGULAR,
} from '../../util/constants';
import AuthorizationService from './authorizationService';

const unauthenticatedReturn = {
    authenticated: false,
    username: null,
};

class AuthenticateService {
    pems;

    constructor() {
        this.authConfig = getAuthConfig();
    }

    prepareToValidateToken = async (req, res) => {
        try {
            const accessToken = req.headers[this.authConfig.CONFIG.authTokenHeaderAttribute];
            logger.debug(`Given access token: ${accessToken}`);

            if (!accessToken) {
                const errorMessage = 'Access token is missing from header';
                logger.error(errorMessage);
                return this.sendUnauthenticatedErrorResponse(errorMessage);
            }

            if (!this.pems || Object.keys(this.pems).length === 0) {
                // Download the JWKs and save it as PEM
                const response = await httpClient.makeRequest(HTTP_GET, this.authConfig.CONFIG.jwkRequestUrl);
                const {keys} = response.data;

                this.pems = {};

                for (let i = 0; i < keys.length; i += 1) {
                    // Convert each key to PEM
                    const keyId = keys[i].kid;
                    const modulus = keys[i].n;
                    const exponent = keys[i].e;
                    const keyType = keys[i].kty;
                    const jwk = {kty: keyType, n: modulus, e: exponent};
                    this.pems[keyId] = jwkToPem(jwk);
                }
                return this.validateToken(this.pems, accessToken, req, res);
            }
            return this.validateToken(this.pems, accessToken, req, res);
        } catch (e) {
            const errorMessage = 'Unexpected error occurred while validating the token';
            logger.error(`${errorMessage}: ${e} stacktrace: ${e.stackTrace}`);
            return this.sendUnauthenticatedErrorResponse(errorMessage);
        }
    }

    validateToken = (pems, accessToken, req, res) => {
        let errorMessage;
        const decodedJwt = jwt.decode(accessToken, {complete: true});

        if (!decodedJwt) {
            errorMessage = 'Not a valid JWT token';
            return this.sendUnauthenticatedErrorResponse(errorMessage);
        }

        // Fail if token is not from the matching User Pool
        if (decodedJwt.payload.iss !== this.authConfig.CONFIG.authTokenIssuer) {
            errorMessage = 'The issuer of the token is invalid';
            logger.error(errorMessage);
            return this.sendUnauthenticatedErrorResponse(errorMessage);
        }

        // Reject the jwt if it's not an 'Access Token'
        if (decodedJwt.payload.token_use !== 'access') {
            errorMessage = 'Token is not an access token';
            logger.error(errorMessage);
            return this.sendUnauthenticatedErrorResponse(errorMessage);
        }

        const {kid} = decodedJwt.header;

        const pem = pems[kid];
        if (!pem) {
            logger.error('No pem could be found for the given kid', kid);
            return this.sendUnauthenticatedErrorResponse('Invalid access token');
        }

        let returnObj = unauthenticatedReturn;
        // Verify the signature of the JWT token to ensure it's really coming from the matching User Pool
        jwt.verify(accessToken, pem, {algorithms: ['RS256']}, (err, payload) => {
            if (err) {
                logger.error(`Token was failed to be verified with error: ${err}`);
                const cause = err.message || 'Token was failed to be verified';
                returnObj = this.sendUnauthenticatedErrorResponse(cause);
            } else {
                const principalId = payload.sub;
                if (principalId) {
                    // Pass to the authorization
                    logger.info(`The user's principal id: ${principalId}`);

                    returnObj = this.decodeUserClaimToken(req, res);
                } else {
                    logger.error(`After token verification principal id: ${principalId} is not present`);
                    returnObj = this.sendUnauthenticatedErrorResponse('Required variables for authentication are invalid');
                }
            }
        });
        return returnObj;
    }

    sendUnauthenticatedErrorResponse = (cause) => ({
        authenticated: false,
        username: null,
        cause,
    })

    // eslint-disable-next-line no-unused-vars
    decodeUserClaimToken = (req, res) => {
        const userClaimToken = req.headers[this.authConfig.CONFIG.userClaimHeaderAttribute];
        logger.debug(`Given user claim token: ${userClaimToken}`);

        const decodedPayloadFromJwt = JSON.parse(Buffer.from(userClaimToken.split('.')[1], 'base64').toString());
        logger.info(JSON.stringify(decodedPayloadFromJwt));

        if (decodedPayloadFromJwt) {
            if (decodedPayloadFromJwt.username) {
                const username = decodedPayloadFromJwt.username.split('_')[1];
                if (username) {
                    const {locale} = decodedPayloadFromJwt;
                    let opcoParsed;
                    let opcoString;

                    try {
                        opcoString = locale.substring(0, 3);
                        opcoParsed = parseInt(opcoString, 10);
                    } catch (e) {
                        logger.error(`Authorized OPCO value given in the auth token is not in the expected format: ${locale}.
                         So error occurred while processing: ${e}, stacktrace: ${e.stack}`);

                        return this.sendUnauthenticatedErrorResponse('Authorized OPCO given in the authentication token is invalid');
                    }

                    let authorizedPricingTransformationEnabledBunitList;
                    let authorizedBatchEnabledBunitList;
                    let selectedUserRole;
                    let selectedCIPZUserRole = '';
                    if (Number.isNaN(opcoParsed)) {
                        logger.warn(`User's opco attribute: ${opcoParsed} is not numeric parsable, so returning empty set of authorized opco list`);
                        authorizedPricingTransformationEnabledBunitList = [];
                        authorizedBatchEnabledBunitList = [];
                    } else {
                        // User roles can come in two formats
                        // If it's single role: it'll come like a string "appadmin"
                        // If it's multiple: it'll come like "[appadmin, generaluser]"

                        const userRoles = decodedPayloadFromJwt.profile;
                        const roleResult = this.extractCIPZRoleDetails(userRoles);
                        if (roleResult !== '') {
                            selectedUserRole = roleResult.userRole;
                            selectedCIPZUserRole = roleResult.cipzUserRole;
                        } else {
                            // either array or single string , arrays will be sorted below or single regular role value which is assigned here
                            selectedUserRole = userRoles;
                        }
                        //  Issue when only reviewer and submitter comes
                        // '[appadmin, generaluser, submitter,approver]', '[appadmin, generaluser]' ,'[submitter,approver]'
                        // above can come and for returns for each case (appadmin, approver )/(appadmin ,'')/ ('', approver)
                        try {
                            const userRolesArray = userRoles.split(',').map((item) => item.trim());

                            if (userRolesArray.length > 1) {
                                userRolesArray[0] = userRolesArray[0].substring(1);

                                const lastElement = userRolesArray[userRolesArray.length - 1];
                                userRolesArray[userRolesArray.length - 1] = lastElement.substring(0, lastElement.length - 1);
                                selectedUserRole = AuthorizationService.getTheRoleWithHighestAuthority(userRolesArray, ROLE_REGULAR);
                                selectedCIPZUserRole = AuthorizationService.getTheRoleWithHighestAuthority(userRolesArray, ROLE_CIPZ);
                            }
                        } catch (e) {
                            logger.error(`Error in parsing the user role value: ${userRoles}`);
                            selectedUserRole = userRoles;
                        }

                        // selected use role either empty , regular or
                        const authorizedBunitList = AuthorizationService.getAuthorizedBusinessUnits(opcoString, selectedUserRole);
                        authorizedPricingTransformationEnabledBunitList = authorizedBunitList.authorizedPricingTransformationEnabledBunitList;
                        authorizedBatchEnabledBunitList = authorizedBunitList.authorizedBatchEnabledBunitList;
                    }
                    const userDetailsData = {
                        authorizedPricingTransformationEnabledBunitList,
                        authorizedBatchEnabledBunitList,
                        firstName: decodedPayloadFromJwt.given_name,
                        lastName: decodedPayloadFromJwt.family_name,
                        username,
                        email: decodedPayloadFromJwt.email,
                        jobTitle: decodedPayloadFromJwt.zoneinfo,
                        role: selectedUserRole,
                        cipzRole: selectedCIPZUserRole,
                    };

                    logger.info(`Authenticated user's user details: First name: ${userDetailsData.firstName}
                    Last name: ${userDetailsData.lastName} Username: ${userDetailsData.username}
                     Email: ${userDetailsData.email}`);

                    logger.info(`User is identified with a job title: ${userDetailsData.jobTitle} and role: ${selectedUserRole}`);

                    return {
                        authenticated: true,
                        username,
                        cause: null,
                        userDetailsData,
                    };
                }
                logger.error(`Username in the auth token is not in the expected format: ${username}`);
                return this.sendUnauthenticatedErrorResponse('Username given in the authentication token is invalid');
            }
            logger.error('Username is not present in the auth token');
            return this.sendUnauthenticatedErrorResponse('Username is not present in the auth token');
        }
    }

    extractCIPZRoleDetails= (userRoles) => {
        if (userRoles === ROLE_CIPZ_SUBMITTER || userRoles === ROLE_CIPZ_REVIEWER) {
            return {
                cipzUserRole: userRoles,
                userRole: '',
            };
        }
        // eslint-disable one-return-only
        return '';
    }
}

export default new AuthenticateService();
