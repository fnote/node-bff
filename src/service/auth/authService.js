import * as jwt from "jsonwebtoken";
import logger from "../../util/logger";
import * as HttpStatus from "http-status-codes";
import {createErrorResponse} from "../../mapper/responseMapper";
import jwkToPem from "jwk-to-pem";
import {getAuthConfig} from "../../config/configs";

const unauthenticatedReturn = {
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

            token = 'eyJraWQiOiJzYzVyUWJiMiszZnM3cmI5ODNBY0ZLZVhLNVJFdXgrMlpraUhlejE2ZlU0PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI3YzA2N2RkNy04ZWExLTQ1NGMtOTJiMC03Mjc2MGM3NGJhOTciLCJjb2duaXRvOmdyb3VwcyI6WyJ1cy1lYXN0LTFfSTVkdE5FOWQxX0F6dXJlQUQiXSwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJvcGVuaWQiLCJhdXRoX3RpbWUiOjE1OTQ5MjUyMzYsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX0k1ZHRORTlkMSIsImV4cCI6MTU5NDkyODgzNiwiaWF0IjoxNTk0OTI1MjM2LCJ2ZXJzaW9uIjoyLCJqdGkiOiJhNTA2ZmNjZi1mMWE5LTQ5ZjQtYmIwOC1lMzJiMDg4MmIwMmYiLCJjbGllbnRfaWQiOiIydDE2b3FxZWEzZHM1YzJvcnAzcnBxbWU1YiIsInVzZXJuYW1lIjoiYXp1cmVhZF9hZGlzMDg5MiJ9.ZchsyUq1UUJRYvdQ1kKOqUCB2_U3pNmz5H3YP-pcKsqD4zsyfIvY7ZEZGviE-muxXBnssGEz4_ISJg4nr9DqvzCBnHOUzYMtRW-HVm20kboWDhH5JMpToA-m61Fqiyn7Y6NLwp6VlqIk3JQEbFxPJkLbhCv2uhQrFQp17CH1H-St5iwuy_2E0oo6WXR-mibVlkk1ARinfmT2dvMckpbxVMJPfV6yQxIqURHtRl89tQO-DYx6InugSm3shkjWCgCdr0EM-Hm1ig50b4dVbg0gPgAy7jt9LzO9FDO1xQ3RvHa8nTGiH3hNtss3i4_GDv_hjNaHlZLOih9npDdGawHldw'


            if (!token) {
                let errorMessage = 'Access token is missing from header';
                logger.error(errorMessage);
                this.sendUnauthenticatedErrorResponse(res, errorMessage);
                return unauthenticatedReturn;
            }

            if (!this.pems) {
                this.pems = {};

                //Download the JWKs and save it as PEM
                let response = await fetch(this.authConfig.CONFIG.jwkRequestUrl);
                let data = await response.json();
                let keys = data['keys'];
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
            let errorMessage = `Unexpected error occurred while validating the token`
            this.sendUnauthenticatedErrorResponse(res, errorMessage);
            logger.error(`${errorMessage}: ${e}`);
            return unauthenticatedReturn;
        }
    }

    validateToken = (pems, token, res) => {
        let errorMessage = 'Token validation errored out';
        let decodedJwt = jwt.decode(token, {complete: true});

        if (!decodedJwt) {
            errorMessage = 'Not a valid JWT token';
            this.sendUnauthenticatedErrorResponse(res, errorMessage)
            return unauthenticatedReturn;
        }

        // Fail if token is not from our User Pool
        if (decodedJwt.payload.iss !== this.authConfig.CONFIG.authTokenIssuer) {
            errorMessage = 'The issuer of the token is invalid';
            logger.error(errorMessage);
            this.sendUnauthenticatedErrorResponse(res, errorMessage);
            return unauthenticatedReturn;
        }

        //Reject the jwt if it's not an 'Access Token'
        if (decodedJwt.payload.token_use !== 'access') {
            errorMessage = 'Token is not an access toke';
            logger.error(errorMessage);
            this.sendUnauthenticatedErrorResponse(res, errorMessage);
            return unauthenticatedReturn;
        }

        let kid = decodedJwt.header.kid;

        let pem = pems[kid];
        if (!pem) {
            logger.error('No pem could be found for the given kid', kid);
            this.sendUnauthenticatedErrorResponse(res, 'Invalid access token')
            return unauthenticatedReturn;
        }

        let returnObj = unauthenticatedReturn;
        //Verify the signature of the JWT token to ensure it's really coming from our User Pool
        jwt.verify(token, pem, {algorithms: ["RS256"]}, (err, payload) => {
            if (err) {
                logger.error('Token was failed to be verified with error:', err);
                this.sendUnauthenticatedErrorResponse(res, err.message);
                returnObj = unauthenticatedReturn;

            } else {
                let principalId = payload.sub;
                let usernameWithAdTag = payload.username;

                if (!principalId && !usernameWithAdTag) {
                    let username = usernameWithAdTag.split('_')[1];
                    if (!username) {
                        // Pass to the authorization
                        logger.info(`The user's principal id:`, principalId, `username:`, username);
                        returnObj = {
                            authenticated: true,
                            username: username
                        };
                    }
                }
                returnObj = unauthenticatedReturn;
            }
        });

        return returnObj;
    }

    sendUnauthenticatedErrorResponse = (res, cause) => {
        res.status(HttpStatus.UNAUTHORIZED).send(createErrorResponse('Unauthorized', 'User cannot be authenticated',
            null, cause));
    }

}

export default new AuthService();