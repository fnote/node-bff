/**
 * Error Handler unit tests
 *
 * @author: gkar5861 on 23/06/20
 * */
import {ERROR} from '../../util/constants';
import {handleError} from '../errorHandler';
import {INTERNAL_SERVER_ERROR} from "http-status-codes";

const message = 'message';
const errorType = INTERNAL_SERVER_ERROR;
const error = {
    name: errorType,
    message,
};

describe('Error Handler', () => {
    test('should return error response as status error', async () => {
        const response2 = {
            "cause": undefined,
            status: ERROR,
            message,
        };

        const jsonObj = jest.fn();
        const responsePassed = {
            status: jest.fn(() => ({
                json: jsonObj,
            })),
        };

        handleError(error, responsePassed);
        expect(responsePassed.status).toHaveBeenCalledWith(errorType);
        expect(jsonObj).toHaveBeenCalledWith(response2);
    });
});
