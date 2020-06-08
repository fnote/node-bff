import winston from 'winston';

class Logger {
    constructor() {
        this.log = winston.createLogger({
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.json(),
                    ),
                }),
            ],
        });
    }

    info(message) {
        this.log.info(message);
    }

    warn(message) {
        this.log.warn(message);
    }

    error(err, message) {
        this.log.error(`Error: ${err} \n${message}`);
    }

    debug(message) {
        this.log.debug(message);
    }
}

export default new Logger();
