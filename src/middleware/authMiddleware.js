import {AUTHENTICATION_NOT_REQUIRED_HEALTH_CHECK} from "../util/constants";
import AuthService from '../service/auth/authService';
import logger from "../util/logger";

export async function authMiddleware(req, res, next) {
    if (process.env.STAGE !== 'LOCAL' && (req.url !== AUTHENTICATION_NOT_REQUIRED_HEALTH_CHECK)) {
        logger.debug(`Sending to authenticate the request`);
        let authResponse = await AuthService.prepareToValidateToken(req, res);
        if (authResponse.authenticated) {
            res.locals.username = authResponse.username;
            next();
        }
    } else {
        next();
    }
}