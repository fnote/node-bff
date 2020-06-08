/**
 * Middleware for error handling
 *
 * @author: gkar5861 on 04/06/20
 **/

class ErrorHandler extends Error {
    constructor(statusCode, message) {
        super();
        this.name = statusCode;
        this.message = message;
    }
}

const handleError = (err, res) => {
    const {name, message} = err;
    res.status(name).json({
        status: "error",
        name,
        message
    });
};

module.exports = {
    ErrorHandler,
    handleError
};
