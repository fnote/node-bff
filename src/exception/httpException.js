export default class HttpException extends Error {
    constructor(error, errorCode) {
        super(error.toString());
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
        this.stack += `\nCaused By:\n${error.stack}`;
        this.errorDetails = {};
        if (error.response) {
            this.errorDetails.response = {
                data: error.response.data,
                status: error.response.status,
                headers: error.response.headers,
            };
        } else if (error.request) {
            this.errorDetails.request = { ...error.request };
        } else {
            this.errorDetails = {
                address: error.address,
                code: error.code,
                dest: error.dest,
                errno: error.errno,
                info: error.info,
                path: error.path,
                port: error.port,
                syscall: error.syscall,
            };
        }
        this.errorDetails.message = error.message;
        this.errorDetails.config = error.config;
    }

    getStatus() {
        if (this.errorDetails.response && this.errorDetails.response.status) {
            return this.errorDetails.response.status;
        }
        return -1;
    }

    getFaultCode() {
        if (this.errorDetails.response && this.errorDetails.response.data
            && this.errorDetails.response.data.fault
            && this.errorDetails.response.data.fault.code) {
            return this.errorDetails.response.data.fault.code;
        }
        return -1;
    }
}
