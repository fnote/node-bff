/**
 * API Central access token generator service
 *
 * @author: cwic0864 on 07/08/20
 * */

import logger from './logger';
import {httpClient} from '../httpClient/httpClient';
import {API_CENTRAL_NEW_ACCESS_TOKEN} from './logCodes';
import {getSsmConfig} from '../service/aws/ssmService';

const URL = `${process.env.API_CENTRAL_BASE_URL}/token?grant_type=client_credentials`;

let authorizationToken = null;
let tokenGeneratedAt = null;
let expiredIn = null;

function isExpired() {
    if (tokenGeneratedAt && expiredIn) {
        return (Date.now() - tokenGeneratedAt) / 1000 > expiredIn - 5;
    }
    return true;
}

export const getAccessToken = async (expired = false) => {
    try {
        if (expired || authorizationToken === null) {
            /**
             * Re-check to avoid the unnecessary token generation
             */
            if (isExpired()) {
                const headers = {
                    Authorization: `Basic ${await getSsmConfig('ApiCentralAuthorizationToken')}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                };

                const requestBody = {
                        grant_type: 'client_credentials',
                };

                const res = await httpClient.makeRequest('post', URL, requestBody, headers);
                tokenGeneratedAt = Date.now();
                const oldAccessToken = authorizationToken;
                authorizationToken = `${res.data.token_type} ${res.data.access_token}`;
                expiredIn = res.data.expires_in;
                logger.info(`new access token generated | Old token: ${oldAccessToken} 
                    | New token: ${authorizationToken}`, API_CENTRAL_NEW_ACCESS_TOKEN);
            }
        }
        return authorizationToken;
    } catch (error) {
        logger.error(error);
        throw new Error(error.toString());
    }
};
