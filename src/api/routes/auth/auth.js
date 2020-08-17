/**
 * Exposes auth related routes and functions
 *
 * @author: adis0892 on 18/07/20
 * */
import {Router} from 'express';
import {getAuthConfig} from '../../../config/configs';
import logger from '../../../util/logger';

export default () => {
    const AuthRouter = new Router({mergeParams: true});
    const authConfig = getAuthConfig();

    AuthRouter.get('/login', async (req, res) => {
        const {authResponse} = res.locals;
        if (authResponse.authenticated) {
            logger.debug(`User: ${authResponse.username} is being redirected after the login`);
            res.redirect(`${authConfig.CONFIG.loginRedirectionUrl}?username=${username}`);
        } else {
            const cause = authResponse.cause;
            logger.error(`User authentication failed, so redirecting user back to login page. cause: ${cause}`);
            res.redirect(`${authConfig.CONFIG.loginRedirectionUrl}?login=error`);
        }
    });

    AuthRouter.get('/logout', (req, res) => {
        res.clearCookie(authConfig.CONFIG.authCookieName1);
        res.clearCookie(authConfig.CONFIG.authCookieName2);

        res.redirect(authConfig.CONFIG.logoutRedirectionUrl);
    });

    AuthRouter.get('/user-details', (req, res) => {

    });

    return AuthRouter;
};
