/**
 * Customized Exception Class for Cloud pricing data fetch
 *
 * @author: adis0892 on 03/08/20
 * */
export default class CloudPricingDataFetchException extends Error {
    constructor(error, cause) {
        super(error.toString());
        Error.captureStackTrace(this, this.constructor);

        this.name = this.constructor.name;
        this.errorDetails = {};

        this.cause = cause
        this.errorDetails.message = error;
    }

    getStatus() {
        if (this.errorDetails.response && this.errorDetails.response.status) {
            return this.errorDetails.response.status;
        }
        return -1;
    }
}
