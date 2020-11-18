import winston from 'winston';
import { getCorrelationId } from './correlationIdGenerator';

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
        this.log.info(`Correlation Id: ${getCorrelationId()} ${message}`);
    }

    warn(message) {
        this.log.warn(message);
    }

    error(err) {
        this.log.error(`Correlation Id: ${getCorrelationId()} ${err.toString()}`);
    }

    debug(message) {
        this.log.debug(message);
    }
}

export default new Logger();
