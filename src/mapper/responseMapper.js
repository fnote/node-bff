/**
 * Create Success and Error Responses
 *
 * @author: gkar5861 on 19/06/20
 * */
import {ERROR, SUCCESS} from "../util/constants";

export function createSuccessResponse(data, message) {
    if (data === undefined) {
        throw new Error("Failure in response creation");
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

export function createErrorResponse(error, message) {
    const errorResponse = {
        status: ERROR,
        message: message || "Internal server error",
    };

    if (error) {
        errorResponse.cause = error.errorDetails ? error.errorDetails.message : error;
    }
    return errorResponse;
}
