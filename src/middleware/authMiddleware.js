import {AUTHENTICATION_NOT_REQUIRED_HEALTH_CHECK} from "../util/constants";
import AuthService from '../service/auth/authService';

export async function authMiddleware (req, res, next) {
    if (process.env.STAGE !== 'local' || !req.url.includes(AUTHENTICATION_NOT_REQUIRED_HEALTH_CHECK)) {
        let authResponse = await AuthService.prepareToValidateToken(req, res);

            if (authResponse.authenticated) {
                res.locals.username = authResponse.username;
                next();
            }


    } else {
        next();
    }
}