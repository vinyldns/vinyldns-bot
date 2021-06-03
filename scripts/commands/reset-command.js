'use strict';

const {TextCommand, CommandDescriptor, Session, util} = require("../lib");

/**
 * Resets any open dialogs that the bot may have. Useful if the bot gets stuck thinking it's in a dialog.
 */
class ResetCommand extends TextCommand {
    /**
     *
     * @param parent {Command} the parent command, if applicable
     */
    constructor(parent) {
        super(parent);
        this._pattern = /^reset(?:\s+@?(.*))?/i;
    }

    /**
     * @inheritDoc
     */
    get descriptor() {
        return new CommandDescriptor()
            .withName("reset")
            .withUsage("reset")
            .withDescription("Resets any open dialogs that the bot may have. Useful if the bot gets stuck thinking it's in a dialog.");
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
        const numOpenDialogs = Session.instance.conversation.numOpenDialogs;
        if (numOpenDialogs === 0) {
            interaction.replyDirect("No dialogs currently open");
            return;
        }
        if (parameters.length > 1 && util.isNotNullOrEmpty(parameters[1])) {
            // Reset for specific user
            let username = parameters[1];
            let user = interaction.findUserForName(username);
            if (util.isNullOrEmpty(user) || util.isNullOrEmpty(user.id)) {
                interaction.replyDirect(`Cannot find user with name \`@${parameters[1]}\``)
            } else {
                const numDialogsForUser = Session.instance.conversation.numOpenDialogsFor(user.id);
                if (numDialogsForUser === 0) {
                    interaction.replyDirect(`No dialogs currently open with \`@${user.name}\``);
                    return;
                }
                interaction.replyDirect(`Resetting ${numDialogsForUser} dialogs for \`@${user.name}\``);
                Session.instance.conversation.resetFor(user.id);
            }
        } else {
            interaction.replyDirect("Resetting " + numOpenDialogs + " open dialogs..");
            Session.instance.conversation.reset();
        }
    }
}

module.exports = ResetCommand;
