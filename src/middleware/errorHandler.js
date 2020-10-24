/**
 * Middleware for error handling
 *
 * @author: gkar5861 on 04/06/20
 * */
import {ERROR, LOGIN_URL} from '../util/constants';
import logger from '../util/logger';
import {INTERNAL_SERVER_ERROR} from "http-status-codes";
import {getAuthConfig} from '../config/configs';

const authConfig = getAuthConfig();

export function handleError(err, req, res) {
    logger.error(`Unhandled error occurred: ${err}, stacktrace: ${err.stack}`);
    const {cause, message} = err;
    if (req.url === LOGIN_URL) {
        res.redirect(`${authConfig.CONFIG.loginRedirectionUrl}?login=error`);
    } else {
        res.status(INTERNAL_SERVER_ERROR).json({
            status: ERROR,
            message,
            cause
        });
    }
}
