'use strict';

const {TextCommand, CommandDescriptor} = require("../lib");
const {bot_config} = require('../config');

/**
 * Displays information and stats about the bot.
 */
class StatCommand extends TextCommand {
    /**
     * @param parent {Command} the parent command, if applicable
     */
    constructor(parent) {
        super(parent);
    }

    /**
     * @inheritDoc
     */
    get descriptor() {
        return new CommandDescriptor()
            .withName("stat")
            .withUsage("stat")
            .withDescription("Displays information and stats about the bot");
    }

    /**
     * @inheritDoc
     */
    canExecute(interaction) {
        return super.canExecute(interaction) && /^stat/i.test(interaction.requestText);
    }

    /**
     * @inheritDoc
     */
    async execute(interaction) {
        interaction.replyDirect("Version: " + bot_config.build_version);
    }
}

module.exports = StatCommand;
