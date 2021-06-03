'use strict';

const path = require("path");
const resourcePath = path.join(__dirname, "../resources/");

const jobs_config = {
    dailyMessage: {
        schedule: "0 9 * * 1-5", // 0900 AM, daily
        channel: "slack-channel-name",
        /** @type {string} */
        message: require("fs").readFileSync(path.join(resourcePath, "DailyMessage.txt"), {encoding: 'utf8'})
    }
};

module.exports = jobs_config;
