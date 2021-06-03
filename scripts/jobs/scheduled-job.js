'use strict';

/**
 * A job that is scheduled to run periodically.
 */
/*eslint no-unused-vars:0*/
class ScheduledJob {
    /**
     * @param name {string} - The name of the job
     */
    constructor(name) {
        this._name = name;
        if (this.constructor === ScheduledJob) {
            throw new TypeError('Abstract class "ScheduledJob" cannot be instantiated directly.');
        }
    }

    /**
     * @returns {string}
     */
    get name() {
        return this._name;
    }

    /**
     * @returns {string|null} - The schedule in cron format.
     */
    // eslint-disable-next-line getter-return
    get schedule() {
    }

    /**
     * The method to execute when the job is triggered.
     */
    execute() {
    }

    /**
     * Registers this job with the scheduler.
     * @param schedulerService {SchedulerService}
     */
    static register(schedulerService) {
    }
}

module.exports = ScheduledJob;