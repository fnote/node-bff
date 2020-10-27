/**
 * Create Success and Error Responses
 *
 * @author: gkar5861 on 19/06/20
 * */
import {ERROR, SUCCESS} from '../util/constants';
import { INTERNAL_SERVER_ERROR_CODE } from '../exception/exceptionCodes'

export function createSuccessResponse(data, message) {
    if (data === undefined) {
        throw new Error('Failure in response creation');
    }
    const dataAttribute = data.data;
    return {
        status: SUCCESS,
        message,
        data: dataAttribute && dataAttribute.data
            ? dataAttribute.data
            : dataAttribute,
    };
}

export function createErrorResponse(status, message, error, cause, errorCode) {
    const errorResponse = {
        status: status || ERROR,
        message: message || 'Internal server error',
    };

    if (cause || error) {
        errorResponse.cause = cause || (error.errorDetails ? error.errorDetails.message : error);
    }

    errorResponse.errorCode = errorCode || INTERNAL_SERVER_ERROR_CODE;
    
    return errorResponse;
}
