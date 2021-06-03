'use strict';

const Command = require("./command");
const util = require("./util");

/**
 * Base class for commands that interact with text
 */
class TextCommand extends Command {

    constructor(parent) {
        super(parent);
        if (this.constructor === TextCommand) {
            throw new TypeError('Abstract class "TextCommand" cannot be instantiated directly.');
        }
    }

    /**
     * @inheritDoc
     * @param interaction {Interaction}
     * @returns {boolean}
     */
    canExecute(interaction) {
        return super.canExecute(interaction) && util.isNotNullOrEmpty(interaction.requestText);
    }
}

module.exports = TextCommand;