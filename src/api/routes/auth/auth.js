/**
 * Exposes auth related routes and functions
 *
 * @author: adis0892 on 18/07/20
 * */
import {Router} from 'express';
import {getAuthConfig} from '../../../config/configs';
import logger from '../../../util/logger';
import * as HttpStatus from "http-status-codes";
import {createErrorResponse} from "../../../mapper/responseMapper";

export default () => {
    const AuthRouter = new Router({mergeParams: true});
    const authConfig = getAuthConfig();

    AuthRouter.get('/login', async (req, res) => {
        const {authResponse} = res.locals;
        if (authResponse && authResponse.authenticated) {
            const username = authResponse.username;
            logger.debug(`User: ${username} is being redirected after the login`);
            res.redirect(`${authConfig.CONFIG.loginRedirectionUrl}?username=${username}`);
        } else {
            const cause = authResponse ? authResponse.cause : 'No auth response';
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

        const {authResponse} = res.locals;
        if (authResponse && authResponse.authenticated) {
            const userDetailsData = authResponse.userDetailsData;

            if (userDetailsData && Object.keys(userDetailsData).length > 0) {
                res.status(HttpStatus.OK).send(userDetailsData);
            } else {
                res.status(HttpStatus.UNAUTHORIZED).send(createErrorResponse('Unauthorized', 'User cannot be authenticated',
                    null, 'User details are not present'));
            }

        } else {
            const cause = authResponse ? authResponse.cause : null
            res.status(HttpStatus.UNAUTHORIZED).send(createErrorResponse('Unauthorized', 'User cannot be authenticated',
                null, cause));
        }
    });

    return AuthRouter;
};
