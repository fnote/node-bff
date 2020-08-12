/**
 * Customized Exception Class for Product Info fetch
 *
 * @author: cwic0864 on 07/08/20
 * */
export default class ProductInfoDataFetchException extends Error {
    constructor(error, errorMessage) {
        super(error.toString());
        Error.captureStackTrace(this, this.constructor);

        this.name = this.constructor.name;
        this.errorDetails = {};

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
