import {loadSsmConfigs} from './service/aws/ssmService';
import {getAccessToken} from './util/accessTokenGenerator';
import logger from './util/logger';
import AuthorizationService from './service/auth/authorizationService';

/**
 * Lambda initializer for hot starts
 *
 * @author: cwic0864 on 09/08/20
 * */

// lambda container state state
let hotStart = true;

export async function initializer(req, res, next) {
    if (hotStart) {
        try {
            logger.info('Initializer started');
            /**
             * Initializing Lambda function configs on Hot start
             * - Load configurations from the AWS SSM
             * - Load opco related details
             */
            await loadSsmConfigs();

            await AuthorizationService.loadBusinessUnitDetails();

            /**
             * Generate access token at the synchronous level to avoid
             * multiple token generations can happen at a hot start
             */
            await getAccessToken();

            // change lambda container state
            hotStart = false;
            logger.info('Initializer completed');
            next();
        } catch (error) {
            hotStart = true;
            next(error);
        }
    } else {
        next();
    }
}
