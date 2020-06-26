import winston from 'winston';
import {v4 as uuidv4} from 'uuid';

const correlator = require('express-correlation-id');

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

    error(err) {
        const incidentId = uuidv4();
        const correlationId = correlator.getId();
        this.log.error(`Correlation Id: ${correlationId} Incident Id: ${incidentId} ${err.toString()}`);
    }

    debug(message) {
        this.log.debug(message);
    }
}

export default new Logger();
