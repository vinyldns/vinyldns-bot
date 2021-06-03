'use strict';

const TextCommand = require("./text-command");

/**
 * Base class for commands that react to messages not necessarily directed at the bot
 */
class UnsolicitedCommand extends TextCommand {
    constructor(parent) {
        super(parent);
        if (this.constructor === UnsolicitedCommand) {
            throw new TypeError('Abstract class "UnsolicitedCommand" cannot be instantiated directly.');
        }
    }

    /**
     * @inheritDoc
     * @param interaction {Interaction}
     * @returns {boolean}
     */
    canExecute(interaction) {
        return super.canExecute(interaction);
    }

    /**
     * @inheritDoc
     */
    get descriptor() {
        // Unsolicited commands are not directly executable and therefore don't have a "usage" description.
        return null;
    }
}

module.exports = UnsolicitedCommand;
