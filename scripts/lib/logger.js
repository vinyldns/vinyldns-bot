'use strict';
const winston = require('winston');
const {combine, json, timestamp, errors} = winston.format;
const util = require("../lib/util");

class Logger {
    constructor(location) {
        this._logger = winston.createLogger({
            level: 'info',
            format: combine(timestamp({format: 'YYYY-MM-DD HH:mm:ss'}), json(), errors({stack: true})),
            defaultMeta: {location: location},
            transports: [
                new winston.transports.File({filename: 'logs/activity.log'})
            ],
            exitOnError: false
        });

        if (process.env.NODE_ENV !== 'production') {
            this._logger.add(new winston.transports.Console({
                format: combine(timestamp({format: 'YYYY-MM-DD HH:mm:ss'}), json(), errors({stack: true}))
            }));
        }
    }

    /**
     * Logs the given data at info level.
     *
     * @param data {object} - The text to log.
     */
    info(data) {
        this._logger.info(data);
    }

    /**
     * Logs the given data at warn level.
     *
     * @param {string} message - The text to log.
     * @param {Error} [error] - Optional error.
     */
    warn(message, error) {
        if (util.isNullOrEmpty(error)) {
            this._logger.warn(message);
        } else {
            this._logger.warn(message, error);
        }
    }

    /**
     * Logs the given data at debug level.
     *
     * @param data {object} - The data to log.
     */
    debug(data) {
        this._logger.debug(data);
    }

    /**
     * Logs the given data at error level.
     *
     * @param data {string} - Message/data to log
     * @param error {Error} - The error
     */
    error(data, error) {
        this._logger.error(data, error);
    }

    /**
     * Creates a logger for the given type name.
     * @param typeName {string}
     * @return {Logger}
     */
    static forType(typeName) {
        return new Logger(typeName);
    }
}

module.exports = Logger;
