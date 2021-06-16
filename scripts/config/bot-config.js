/* eslint-disable no-unused-vars */
'use strict';

const util = require("../lib/util");

const bot_config = {
    build_version: util.getValueOrDefault(process.env.BOT_VERSION, "1.0"),
    bot_name: process.env.BOT_NAME, // This will get overridden at runtime with the actual bot's name if not specified
    documentation_url: "https://www.vinyldns.io/portal/",
    max_response_count: process.env.MAX_RESPONSE_COUNT ? process.env.MAX_RESPONSE_COUNT : 100,
    end_conversation_message: null,
    dialog_timeout_ms: process.env.BOT_DIALOG_TIMEOUT ? process.env.BOT_DIALOG_TIMEOUT : 300000,
    fallback_command: "faq-search",
    /**
     * @param response {Interaction}
     */
    default_response: (response) => `For additional help, please check out our documentation ${bot_config.documentation_url}, or mention \`@${bot_config.bot_name}\` for more help.`,
};

/**
 * Retrieve the build version from the VERSION file if present.
 */
require('fs').readFile("VERSION", 'utf8', (err, data) => {
    if (err) {
        console.warn("Cannot find VERSION file.  Using " + bot_config.build_version);
        return;
    }

    if (util.isNotNullOrEmpty(data)) {
        console.info("Setting version to " + data.trim());
        bot_config.build_version = data.trim();
    }
});

module.exports = bot_config;
