/**
 * Error Handler unit tests
 *
 * @author: gkar5861 on 23/06/20
 * */
import {ERROR} from '../../util/constants';
import {handleError} from '../errorHandler';

const message = 'message';
const errorType = 'Internal Error';
const error = {
    name: errorType,
    message,
};

describe('Error Handler', () => {
    test('should return error response as status error', async () => {
        const response2 = {
            status: ERROR,
            name: errorType,
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
