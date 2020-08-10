import {loadSsmConfigs} from './service/aws/ssmService';
import {getAccessToken} from './util/accessTokenGenerator';
import logger from './util/logger';

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
            logger.info('initializer start');
            /**
             * Initializing Lambda function configs on Hot start
             * - Load configurations from the AWS SSM
             */
            await Promise.all([loadSsmConfigs()]);

            /**
             * Generate access token at the synchronous level to avoid
             * multiple token generations can happen at a hot start
             */
            await getAccessToken();

            // change lambda container state
            hotStart = false;
            logger.info('initializer complete');
        } catch (error) {
            next(error);
        }
    }
    next();
}
