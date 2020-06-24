/**
 * Middleware for error handling
 *
 * @author: gkar5861 on 04/06/20
 * */
import {ERROR} from "../util/constants";

export function handleError(err, res) {
    const {name, message} = err;
    res.status(name).json({
        status: ERROR,
        name,
        message,
    });
}
