/**
 * Middleware for error handling
 *
 * @author: gkar5861 on 04/06/20
 * */
import {ERROR} from '../util/constants';
import logger from "../util/logger";

export function handleError(err, res) {
    logger.error(`Unhandled error occurred: ${err}, stacktrace: ${err.stack}`);
    const {name, message} = err;
    res.status(name).json({
        status: ERROR,
        name,
        message,
    });
}
