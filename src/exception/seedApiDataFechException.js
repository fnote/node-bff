export default class SeedApiDataFetchException extends Error {
    constructor(error, cause, errorCode) {
        super(error.toString());
        Error.captureStackTrace(this, this.constructor);

        this.name = this.constructor.name;
        this.errorDetails = {};

        this.cause = cause;
        this.errorDetails.message = error;
        this.errorCode = errorCode;
    }

    getStatus() {
        if (this.errorDetails.response && this.errorDetails.response.status) {
            return this.errorDetails.response.status;
        }
        return -1;
    }
}
