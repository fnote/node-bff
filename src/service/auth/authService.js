/**
 * Auth Service functions
 *
 * @author: adis0892 on 23/07/20
 * */

import * as jwt from "jsonwebtoken";
import logger from "../../util/logger";
import * as HttpStatus from "http-status-codes";
import {createErrorResponse} from "../../mapper/responseMapper";
import jwkToPem from "jwk-to-pem";
import {getAuthConfig} from "../../config/configs";
import {httpClient} from '../../httpClient/httpClient';
import {HTTP_GET} from "../../util/constants";

export const unauthenticatedReturn = {
    authenticated: false,
    username: null
};

class AuthService {
    pems;

    constructor() {
        this.authConfig = getAuthConfig();
    }

    prepareToValidateToken = async (req, res) => {
        try {
            let token = req.headers[this.authConfig.CONFIG.authTokenHeaderAttribute];

            token = 'eyJraWQiOiJzYzVyUWJiMiszZnM3cmI5ODNBY0ZLZVhLNVJFdXgrMlpraUhlejE2ZlU0PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI3YzA2N2RkNy04ZWExLTQ1NGMtOTJiMC03Mjc2MGM3NGJhOTciLCJjb2duaXRvOmdyb3VwcyI6WyJ1cy1lYXN0LTFfSTVkdE5FOWQxX0F6dXJlQUQiXSwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJvcGVuaWQiLCJhdXRoX3RpbWUiOjE1OTYxNDUwNDUsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX0k1ZHRORTlkMSIsImV4cCI6MTU5NjE0ODY0NSwiaWF0IjoxNTk2MTQ1MDQ1LCJ2ZXJzaW9uIjoyLCJqdGkiOiIzYzRmM2YyYy0yNzJhLTQxZGMtYjNmYy00OTZkYWYwNjIzYTMiLCJjbGllbnRfaWQiOiIydDE2b3FxZWEzZHM1YzJvcnAzcnBxbWU1YiIsInVzZXJuYW1lIjoiYXp1cmVhZF9hZGlzMDg5MiJ9.OxbUZ2bh-3_96x3DF_Xc1mNH1b6T_dq9Iux_TQKDN60c2vYRiA6ag2BxZJ7bTL07UBsZsRz1kjiw77SHSzHaT52wlSgiSFw2oRNgspC2loTYtfkaLhsSijLN3fXGRHPwanLRuclY-oqq5w-QB8GcmNbYXWTBYNcp2yEo3SZ9f5LHqMiSGc18rTFM6A6GRjVYIXbGyMIRb5_1mMJTZaQO6doqjVV7AzMEX9ib4F4FAAboMYPhYqDenEth1ZYUy0Eww8N8z2m4Du7WEAykpyL1UyuhOU6loa38R8oPxyFs7l7K6ei6rqp6ylLg8UteJRTI00NrMOH9bLuAklAp3cqFJQ'

            if (!token) {
                let errorMessage = 'Access token is missing from header';
                logger.error(errorMessage);
                return this.sendUnauthenticatedErrorResponse(res, errorMessage);
            }

            if (!this.pems) {
                this.pems = {};

                //Download the JWKs and save it as PEM
                const response = await httpClient.makeRequest(HTTP_GET, this.authConfig.CONFIG.jwkRequestUrl);
                let keys = response.data['keys'];
                for (let i = 0; i < keys.length; i++) {
                    //Convert each key to PEM
                    let keyId = keys[i].kid;
                    let modulus = keys[i].n;
                    let exponent = keys[i].e;
                    let keyType = keys[i].kty;
                    let jwk = {kty: keyType, n: modulus, e: exponent};
                    this.pems[keyId] = jwkToPem(jwk);
                }
                return this.validateToken(this.pems, token, res);


            } else {
                return this.validateToken(this.pems, token, res);
            }
        } catch (e) {
            let errorMessage = `Unexpected error occurred while validating the token`;
            logger.error(`${errorMessage}: ${e}`);
            return this.sendUnauthenticatedErrorResponse(res, errorMessage);
        }
    }

    validateToken = (pems, token, res) => {
        let errorMessage;
        let decodedJwt = jwt.decode(token, {complete: true});

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
            errorMessage = 'Token is not an access toke';
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
        jwt.verify(token, pem, {algorithms: ["RS256"]}, (err, payload) => {
            if (err) {
                logger.error(`Token was failed to be verified with error: ${err}`);
                returnObj = this.sendUnauthenticatedErrorResponse(res, err.message);
            } else {
                let principalId = payload.sub;
                let usernameWithAdTag = payload.username;

                if (principalId && usernameWithAdTag) {
                    let username = usernameWithAdTag.split('_')[1];
                    if (username) {
                        // Pass to the authorization
                        logger.info(`The user's principal id: ${principalId} username: ${username}`);
                        returnObj = {
                            authenticated: true,
                            username: username,
                            cause: null
                        };
                    } else {
                        logger.error(`Username in the auth token is not in the expected format: ${username}`);
                        returnObj = this.sendUnauthenticatedErrorResponse(res, 'Username given in the authentication token is invalid');
                    }
                } else {
                    logger.error(`After token verification either principal id: ${principalId} or username: ${usernameWithAdTag} is not present`);
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

}

export default new AuthService();