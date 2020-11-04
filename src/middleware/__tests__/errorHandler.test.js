/**
 * Error Handler unit tests
 *
 * @author: gkar5861 on 23/06/20
 * */
import {INTERNAL_SERVER_ERROR} from 'http-status-codes';
import {ERROR, LOGIN_URL} from '../../util/constants';
import {handleError} from '../errorHandler';

const message = 'message';
const errorType = INTERNAL_SERVER_ERROR;
const error = {
    name: errorType,
    message,
};

describe('Error Handler', () => {
    test('should return error response as status error', async () => {
        const response2 = {
            cause: undefined,
            status: ERROR,
            message,
        };

        const jsonObj = jest.fn();
        const requestPassed = {};

        const responsePassed = {
            status: jest.fn(() => ({
                json: jsonObj,
            })),
        };

        handleError(error, requestPassed, responsePassed);
        expect(responsePassed.status).toHaveBeenCalledWith(errorType);
        expect(jsonObj).toHaveBeenCalledWith(response2);
    });

    test('should redirect when url is login url', async () => {
        const requestPassed = {
            url: LOGIN_URL,
        };

        const responsePassed = {
            redirect: jest.fn(),
        };

        handleError(error, requestPassed, responsePassed);
        expect(responsePassed.redirect.mock.calls.length).toEqual(1);
    });
});
