'use strict';

const TextCommand = require("../lib/text-command");
const {Session} = require("../lib");
const util = require("../lib/util");

/**
 * Displays the usage of all root commands.
 */
class CommandUsageCommand extends TextCommand {
    /**
     * @param {Command} parent
     * @param {RegExp} [pattern]
     */
    constructor(parent, pattern) {
        super(parent);
        this._pattern = util.getValueOrDefault(pattern, /^command/i);
        this._authService = Session.instance.authService;
    }

    /**
     * @inheritDoc
     */
    get isRootCommand() {
        return false;
    }

    /**
     * @inheritDoc
     */
    canExecute(interaction) {
        return super.canExecute(interaction) && this._pattern.test(interaction.requestText);
    }

    /**
     * @inheritDoc
     */
    async execute(interaction) {
        const commandHelpString = Session.instance.commandRepository
                                         .findRootCommandsFor(interaction, x => !this._authService.isRestricted(x.constructor.name) ||
                                                                                (this._authService.isRestricted(x.constructor.name) && interaction.isDirectMessage && this._authService.hasAccess(x.constructor.name, interaction.userId)))
                                         .filter(x => x instanceof TextCommand && util.isNotNullOrEmpty(x.descriptor))
                                         .map(command => command.descriptor.toHelpString())
                                         .join("\n");
        interaction.reply("\n" + commandHelpString + "\n\nUse `back`, `home` or `help` to go back; `cancel` to end.");
    }
}

module.exports = CommandUsageCommand;
