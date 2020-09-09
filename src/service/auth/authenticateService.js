/**
 * Auth Service functions
 *
 * @author: adis0892 on 23/07/20
 * */

import * as jwt from "jsonwebtoken";
import logger from "../../util/logger";
import jwkToPem from "jwk-to-pem";
import {getAuthConfig} from "../../config/configs";
import {httpClient} from '../../httpClient/httpClient';
import {HTTP_GET} from "../../util/constants";
import AuthorizationService from './authorizationService'

const unauthenticatedReturn = {
    authenticated: false,
    username: null
};

class AuthenticateService {
    pems;

    constructor() {
        this.authConfig = getAuthConfig();
    }

    prepareToValidateToken = async (req, res) => {
        try {
            let accessToken = req.headers[this.authConfig.CONFIG.authTokenHeaderAttribute];

           logger.debug(`Given access token: ${accessToken}`)

            if (!accessToken) {
                let errorMessage = 'Access token is missing from header';
                logger.error(errorMessage);
                return this.sendUnauthenticatedErrorResponse(res, errorMessage);
            }

            if (!this.pems || Object.keys(this.pems).length === 0) {
                //Download the JWKs and save it as PEM
                const response = await httpClient.makeRequest(HTTP_GET, this.authConfig.CONFIG.jwkRequestUrl);
                let keys = response.data['keys'];

                this.pems = {};

                for (let i = 0; i < keys.length; i++) {
                    //Convert each key to PEM
                    let keyId = keys[i].kid;
                    let modulus = keys[i].n;
                    let exponent = keys[i].e;
                    let keyType = keys[i].kty;
                    let jwk = {kty: keyType, n: modulus, e: exponent};
                    this.pems[keyId] = jwkToPem(jwk);
                }
                return this.validateToken(this.pems, accessToken, req, res);


            } else {
                return this.validateToken(this.pems, accessToken, req, res);
            }
        } catch (e) {
            let errorMessage = `Unexpected error occurred while validating the token`;
            console.log(e)
            logger.error(`${errorMessage}: ${e} stacktrace: ${e.stackTrace}`);
            return this.sendUnauthenticatedErrorResponse(res, errorMessage);
        }
    }

    validateToken = (pems, accessToken, req, res) => {
        let errorMessage;
        let decodedJwt = jwt.decode(accessToken, {complete: true});

        if (!decodedJwt) {
            errorMessage = 'Not a valid JWT token';
            return this.sendUnauthenticatedErrorResponse(res, errorMessage)
        }

        // Fail if token is not from the matching User Pool
        if (decodedJwt.payload.iss !== this.authConfig.CONFIG.authTokenIssuer) {
            errorMessage = 'The issuer of the token is invalid';
            logger.error(errorMessage);
            return this.sendUnauthenticatedErrorResponse(res, errorMessage);
        }

        //Reject the jwt if it's not an 'Access Token'
        if (decodedJwt.payload.token_use !== 'access') {
            errorMessage = 'Token is not an access token';
            logger.error(errorMessage);
            return this.sendUnauthenticatedErrorResponse(res, errorMessage);
        }

        let kid = decodedJwt.header.kid;

        let pem = pems[kid];
        if (!pem) {
            logger.error('No pem could be found for the given kid', kid);
            return this.sendUnauthenticatedErrorResponse(res, 'Invalid access token')
        }

        let returnObj = unauthenticatedReturn;
        //Verify the signature of the JWT token to ensure it's really coming from the matching User Pool
        jwt.verify(accessToken, pem, {algorithms: ["RS256"]}, (err, payload) => {
            if (err) {
                logger.error(`Token was failed to be verified with error: ${err}`);
                const cause = err.message || 'Token was failed to be verified';
                returnObj = this.sendUnauthenticatedErrorResponse(res, cause);
            } else {
                const principalId = payload.sub;
                if (principalId) {

                        // Pass to the authorization
                        logger.info(`The user's principal id: ${principalId}`);

                        returnObj = this.decodeUserClaimToken(req, res);

                } else {
                    logger.error(`After token verification principal id: ${principalId} is not present`);
                    returnObj = this.sendUnauthenticatedErrorResponse(res, 'Required variables for authentication are invalid');
                }
            }
        });
        return returnObj;
    }

    sendUnauthenticatedErrorResponse = (res, cause) => {
        return {
            authenticated: false,
            username: null,
            cause: cause
        };
    }

    decodeUserClaimToken = (req, res) => {
        let userClaimToken = req.headers[this.authConfig.CONFIG.userClaimHeaderAttribute];
        logger.debug(`Given user claim token: ${userClaimToken}`);

        const decodedPayloadFromJwt = JSON.parse(Buffer.from(userClaimToken.split('.')[1], 'base64').toString());

        if(decodedPayloadFromJwt) {
            if (decodedPayloadFromJwt.username) {
                const username = decodedPayloadFromJwt.username.split('_')[1];
                if(username) {
                    const locale = decodedPayloadFromJwt.locale;
                    const opcoString = locale.substring(0,3);
                    const opcoParsed = parseInt(opcoString);
                    let authorizedBunitList;
                    if (isNaN(opcoParsed)) {
                        logger.info(`User's opco attribute: ${opcoParsed} is not numeric parsable, so returning empty set of authorized opco list`);
                        authorizedBunitList = [];
                    } else {
                        //User roles can come in two formats
                        //If it's single role: it'll come like a string "rsm"
                        //If it's multiple: it'll come like "[appadmin, generaluser]"

                        const userRoles = decodedPayloadFromJwt.profile;
                        let selectedUserRole = userRoles

                        try {
                            const userRolesArray = userRoles.split(',').map((item) => {
                                return item.trim();
                            });

                            if(userRolesArray.length > 1) {
                                userRolesArray[0] = userRolesArray[0].substring(1);

                                const lastElement = userRolesArray[userRolesArray.length - 1];
                                userRolesArray[userRolesArray.length - 1] = lastElement.substring(0, lastElement.length - 1);

                                selectedUserRole = AuthorizationService.getTheRoleWithHighestAuthority(userRolesArray);
                            }
                        } catch (e) {
                            logger.error(`Error in parsing the user role value: ${userRoles}`);
                            selectedUserRole = userRoles;
                        }
                        authorizedBunitList = AuthorizationService.getAuthorizedBusinessUnits(opcoString, selectedUserRole);
                    }

                    const userDetailsData = {}
                    userDetailsData.authorizedBunitList = authorizedBunitList;
                    userDetailsData.firstName = decodedPayloadFromJwt.given_name;
                    userDetailsData.lastName = decodedPayloadFromJwt.family_name;
                    userDetailsData.username = username;
                    userDetailsData.email = decodedPayloadFromJwt.email;
                    userDetailsData.jobTitle = decodedPayloadFromJwt.zoneinfo;

                    logger.info(`Authenticated user's user details: First name: ${userDetailsData.firstName}
                    Last name: ${userDetailsData.lastName} Username: ${userDetailsData.username} Email: ${userDetailsData.email}`);

                    logger.info(`User is identified with a job title: ${userDetailsData.jobTitle}`);

                    return {
                        authenticated: true,
                        username: username,
                        cause: null,
                        userDetailsData: userDetailsData
                    };
                } else {
                    logger.error(`Username in the auth token is not in the expected format: ${username}`);
                    return this.sendUnauthenticatedErrorResponse(res, 'Username given in the authentication token is invalid');

                }
            } else {
                logger.error(`Username is not present in the auth token`);
                return this.sendUnauthenticatedErrorResponse(res, 'Username is not present in the auth token');
            }
        }
    }
}

export default new AuthenticateService();