'use strict';

const Command = require("./command");

/**
 * Base class for commands that interact with reactions
 */
class ReactionCommand extends Command {

    constructor(parent) {
        super(parent);
        if (this.constructor === ReactionCommand) {
            throw new TypeError('Abstract class "ReactionCommand" cannot be instantiated directly.');
        }
    }

    /**
     * @inheritDoc
     * @param interaction {Interaction}
     * @returns {boolean}
     */
    canExecute(interaction) {
        return super.canExecute(interaction) && interaction.isReactionToBot;
    }
}

module.exports = ReactionCommand;