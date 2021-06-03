'use strict';

const {TextCommand, CommandDescriptor, ParameterDescriptor, util} = require("../lib");

/**
 * Allows for delegating commands to other users
 */
class ForUserCommand extends TextCommand {
    /**
     *
     * @param parent {Command} the parent command, if applicable
     */
    constructor(parent) {
        super(parent);
        this._pattern = /^for @([a-z0-9_-]+)\s+(.*)/i;
    }

    /**
     * @inheritDoc
     */
    get descriptor() {
        return new CommandDescriptor()
            .withName("for")
            .withUsage("for <slack_user> <command>")
            .addParameter(new ParameterDescriptor().withName("slack_user").asRequired().withDescription("The slack user to delegate to"))
            .addParameter(new ParameterDescriptor().withName("command").asRequired().withDescription("The command to execute for the given slack_user"))
            .withDescription("Delegates the given command to the given slack_user");
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
        let parameters = this._pattern.exec(interaction.requestText);
        let forUser = null;
        if (parameters.length > 1) {
            forUser = parameters[1];
        }
        if (util.isNotNullOrEmpty(forUser)) {
            let userToImpersonate = interaction.userForName(forUser);
            if (util.isNotNullOrEmpty(userToImpersonate)) {
                // Rewrite the user on the message
                interaction.impersonate(userToImpersonate);
            }
        }

        // Extract the 'for' directive
        interaction.requestText = interaction.requestText.replace(/for @([a-z0-9_-]+)\s+/ig, "");

        // Reprocess the message
        interaction.reprocess();
    }
}

module.exports = ForUserCommand;
