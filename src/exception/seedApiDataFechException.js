export default class SeedApiDataFetchException extends Error {
    constructor(error, errorMessage, errorCode) {
        super(error.toString());
        Error.captureStackTrace(this, this.constructor);

        this.errorDetails = {};
        this.name = this.constructor.name;

        this.errorCode = errorCode;
        this.stack = error.stack;
        this.errorDetails.message = errorMessage;
    }

    getStatus() {
        if (this.errorDetails.message) {
            return this.errorDetails.message;
        }
        return -1;
    }
}
