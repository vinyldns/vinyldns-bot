'use strict';

const {EventEmitter} = require('events');
const Dialog = require('../dialog');
const util = require("../util");
const {bot_config} = require("../../config");

/**
 * Conversation tracking service.  Maintains the list of open {@link Dialog} instances.
 * @see Dialog
 */
class ConversationService extends EventEmitter {
    /**
     * @param robot {Robot}
     */
    constructor(robot) {
        super();
        this._robot = robot;
    }

    /**
     * @returns {number}
     */
    get numOpenDialogs() {
        return Object.keys(this._robot.brain.data._private).filter(x => x.startsWith("dlg_")).length;
    }

    /**
     * Resets the conversation service by closing all open dialogs.
     */
    reset() {
        this.emit('reset')
    }

    /**
     * Resets all open dialogs for the given userId.
     *
     * @param {string} userId - The user for which to reset any open dialogs.
     */
    resetFor(userId) {
        this.emit('reset_' + userId)
    }

    /**
     * Retrieves the dialog associated with the given interaction.
     *
     * @param interaction {Interaction} The active interaction.
     * @return {Dialog}
     */
    retrieveDialog(interaction) {
        return this._robot.brain.get(this._buildDialogKey(interaction));
    }

    /**
     * Retrieves the number of open dialogs for the given user id
     *
     * @param {string} userId - The user id
     * @returns {number} - The number of open dialogs, if any.
     */
    numOpenDialogsFor(userId) {
        return Object.keys(this._robot.brain.data._private).filter(x => x.startsWith("dlg_" + userId)).length;
    }

    /**
     * Resets any open dialog for the given message.
     *
     * @param interaction {Interaction} The active interaction.
     * @return {Dialog}
     */
    resetDialog(interaction) {
        let dialog = this.retrieveDialog(interaction);
        if (util.isNotNullOrEmpty(dialog)) {
            dialog.reset();
        }
    }

    /**
     * Starts a dialog, or returns an existing dialog.
     *
     * @param {Interaction} interaction - An incoming interaction on which to base a conversation
     * @returns {Dialog}
     */
    openDialog(interaction) {
        let currentDialog = this.retrieveDialog(interaction);
        if (util.isNotNullOrEmpty(currentDialog)) {
            return currentDialog;
        }
        let dialog = this._saveDialog(interaction, new Dialog(bot_config.dialog_timeout_ms));

        //When the dialog expires, delete it.
        dialog.on('expired', () => {
            if (util.isNotNullOrEmpty(bot_config.end_conversation_message)) {
                interaction.reply(bot_config.end_conversation_message(interaction));
            }
            this._deleteDialog(interaction)
        });

        this.on("reset", () => {
            dialog.close();
            this._deleteDialog(interaction);
        });

        this.on("reset_" + interaction.user.id, () => {
            dialog.close();
            this._deleteDialog(interaction);
        });
        return dialog;
    }

    /**
     * Associates the given dialog with the given interaction.
     *
     * @param interaction {Interaction}
     * @param dialog {Dialog}
     * @returns {Dialog} - the saved dialog
     */
    _saveDialog(interaction, dialog) {
        this._robot.brain.set(this._buildDialogKey(interaction), dialog);
        return dialog;
    }

    /**
     * Deletes the dialog associated with the given interaction.
     *
     * @param interaction {Interaction}
     */
    _deleteDialog(interaction) {
        this._robot.brain.remove(this._buildDialogKey(interaction));
    }

    /**
     * Gets the key associated with the given interaction.
     *
     * @param interaction {Interaction}
     * @return {string}
     */
    _buildDialogKey(interaction) {
        return "dlg_" + interaction.user.id + "_" + interaction.threadIdentifier;
    }
}

module.exports = ConversationService;
