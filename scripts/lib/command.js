'use strict';

/**
 * Base class for commands
 */
class Command {
    /**
     * @param parent {Command} the parent command, if applicable
     */
    constructor(parent) {
        this._parent = parent;
        if (this.constructor === Command) {
            throw new TypeError('Abstract class "Command" cannot be instantiated directly.');
        }
    }

    /**
     * @returns {boolean}
     */
    get isRootCommand() {
        return true;
    }

    /**
     * @return {Command}
     */
    get parent() {
        return this._parent;
    }

    /**
     * @param value {Command} - The parent command.
     */
    set parent(value) {
        this._parent = value;
    }

    /**
     * @return {CommandDescriptor}
     */
    // eslint-disable-next-line getter-return
    get descriptor() {
        // To be implemented by subclasses
    }

    /**
     * Determines if this command can be executed for the current interaction.
     *
     * @param interaction {Interaction}
     * @returns {boolean}
     */
    // eslint-disable-next-line getter-return,no-unused-vars
    canExecute(interaction) {
        return true;
    }

    /**
     * Executes this command for the given interaction.
     *
     * @param interaction {Interaction} - The output channel.
     */
    // eslint-disable-next-line no-unused-vars
    async execute(interaction) {
        // To be implemented by subclasses
    }
}

module.exports = Command;