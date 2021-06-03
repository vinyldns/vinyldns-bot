'use strict';

const {TextCommand} = require("../lib");

/**
 * Executes the cancel command.
 */
class CancelCommand extends TextCommand {
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
        return null;
    }

    /**
     * @inheritDoc
     */
    canExecute(interaction) {
        return super.canExecute(interaction) && /^cancel$/i.test(interaction.requestText);
    }

    /**
     * @inheritDoc
     */
    async execute(interaction) {
        interaction.endDialog();
        await interaction.react("thumbsup");
    }
}

module.exports = CancelCommand;
