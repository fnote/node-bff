/**
 * Exposes auth related routes and functions
 *
 * @author: adis0892 on 07/07/20
 * */
import {Router} from 'express';
import {getAuthConfig} from "../../../config/configs";
import logger from "../../../util/logger"

export default () => {
    const AuthRouter = new Router({mergeParams: true});
    const authConfig = getAuthConfig();

    AuthRouter.get('/login', async (req, res) => {
        let username = res.locals.username;
        logger.debug(`User: ${username} is being redirected after the login`);
        res.redirect(authConfig.CONFIG.loginRedirectionUrl + '?username=' + username);
    });

    AuthRouter.get('/logout', (req, res) => {

        res.clearCookie(authConfig.CONFIG.authCookieName1);
        res.clearCookie(authConfig.CONFIG.authCookieName2);

        res.redirect(authConfig.CONFIG.logoutRedirectionUrl);
    });

    return AuthRouter;
};