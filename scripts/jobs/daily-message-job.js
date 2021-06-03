'use strict';

const ScheduledJob = require('./scheduled-job');
const Session = require("../lib/session");
const {jobs_config} = require("../config");
const logger = require("../lib/logger").forType("DailyMessageJob");

/**
 * Scheduled job responsible for sending a message of the day to a channel
 */
class DailyMessageJob extends ScheduledJob {
    constructor() {
        super("DailyMessage");
    }

    /**
     * @inheritDoc
     */
    get schedule() {
        return jobs_config.dailyMessage.schedule;
    }

    /**
     * @inheritDoc
     */
    execute() {
        logger.info("Executing scheduled job " + this.name)
        Session.instance.outputChannel.sendMessage(jobs_config.dailyMessage.channel, jobs_config.dailyMessage.message);
    }

    /**
     * @inheritDoc
     */
    static register(schedulerService) {
        schedulerService.registerJob(new DailyMessageJob())
    }
}

module.exports = DailyMessageJob;