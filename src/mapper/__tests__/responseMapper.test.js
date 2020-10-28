/**
 * Response Mapper unit tests
 *
 * @author: gkar5861 on 23/06/20
 * */
import {ERROR, SUCCESS} from '../../util/constants';
import {createErrorResponse, createSuccessResponse} from '../responseMapper';
import { INTERNAL_SERVER_ERROR_CODE } from '../../exception/exceptionCodes'

const message = 'message';

const data = {
    data: {
        data: {
            data: 'data',
        },
    },
};

describe('Response Mapper', () => {
    test('should return success response with data attr in data when the request is success', async () => {
        const successResponse1 = {
            status: SUCCESS,
            message,
            data: {
                data: 'data',
            },
        };
        const res = createSuccessResponse(data, message);
        expect(res).toEqual(successResponse1);
    });

    test('should return success response without data attr in data when the request is success', async () => {
        const successResponse2 = {
            status: SUCCESS,
            message,
            data: 'data',
        };
        const res = createSuccessResponse(data.data, message);
        expect(res).toEqual(successResponse2);
    });

    test('should throw error without data when the request is success', async () => {
        expect(() => createSuccessResponse(undefined, message)).toThrowError(new Error('Failure in response creation'));
    });

    test('should return error response with error message as cause attr', async () => {
        const error = {
            errorDetails: {
                message: 'cause',
            },
        };

        const errorResponseWithCause = {
            status: {
                errorDetails: {
                    message: 'cause',
                },
            },
            message,
            "errorCode": INTERNAL_SERVER_ERROR_CODE,
        };
        const res = createErrorResponse(error, message);
        expect(res).toEqual(errorResponseWithCause);
    });

    test('should return error response with error as cause attr', async () => {
        const error = {
            message: 'cause',
        };

        const errorResponseWithCause = {
            status: {
                message: 'cause',
            },
            message,
            "errorCode": INTERNAL_SERVER_ERROR_CODE,
        };

        const res = createErrorResponse(error, message);
        expect(res).toEqual(errorResponseWithCause);
    });

    test('should return error response without cause attr when error is null', async () => {
        const errorResponseWithoutCause = {
            status: ERROR,
            message,
            "errorCode": INTERNAL_SERVER_ERROR_CODE,
        };

        const res = createErrorResponse(null, message);
        expect(res).toEqual(errorResponseWithoutCause);
    });
});
