'use strict';

const {Job} = require('node-schedule-tz');
const logger = require("../logger").forType("SchedulerService");

class SchedulerService {
    /**
     * @param job {ScheduledJob} - The job to be scheduled.
     */
    registerJob(job) {
        logger.info(`Registering scheduled job ${job.name} with schedule ${job.schedule}`);
        const jobToSchedule = new Job(job.name, job.execute);
        jobToSchedule.schedule(job.schedule, 'America/New_York');
        SchedulerService.jobs.set(job.name, jobToSchedule)
    }

    static shutdown() {
        SchedulerService.jobs.forEach((v) => v.cancel(false));
    }

    static registerAllJobs() {
        /** @type {Map<string, Job>} */
        SchedulerService.jobs = new Map();
        const normalizedPath = require("path").join(__dirname, "../../jobs");
        const schedulerService = new SchedulerService();
        require("fs").readdirSync(normalizedPath)
                     .forEach((file) => require("../../jobs/" + file).register(schedulerService));
    }
}

module.exports = SchedulerService;