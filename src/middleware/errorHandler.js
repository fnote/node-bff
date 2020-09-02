/**
 * Middleware for error handling
 *
 * @author: gkar5861 on 04/06/20
 * */
import {ERROR} from '../util/constants';
import logger from '../util/logger';
import {INTERNAL_SERVER_ERROR} from "http-status-codes";

export function handleError(err, res) {
    logger.error(`Unhandled error occurred: ${err}, stacktrace: ${err.stack}`);
    const {cause, message} = err;
    res.status(INTERNAL_SERVER_ERROR).json({
        status: ERROR,
        message,
        cause
    });
}
