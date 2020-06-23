/**
 * Customized Exception Class for Invalid Request Types
 *
 * @author: gkar5861 on 22/06/20
 **/
export default class InvalidRequestException extends Error {
    constructor(error, errorStatus) {
        super(error.toString());
        this.name = this.constructor.name;
        this.errorDetails = {};
        this.errorDetails.response = {
            status: errorStatus,
        };

        this.errorDetails.message = error;
    }
    getStatus() {
        if (this.errorDetails.response && this.errorDetails.response.status) {
            return this.errorDetails.response.status;
        }
        return -1;
    }
}
