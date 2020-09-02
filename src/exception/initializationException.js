export default class InitializationException extends Error {

    constructor(error, cause) {
        super(error.toString());
        Error.captureStackTrace(this, this.constructor);

        this.name = this.constructor.name;
        this.errorDetails = {};

        this.cause = cause;
        this.errorDetails.message = error;
    }
}