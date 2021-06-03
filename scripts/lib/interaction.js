'use strict';

const cloneDeep = require('lodash.clonedeep')
const {Response} = require('hubot')
const Session = require('./session');
const Reaction = require('./reaction');
const util = require('./util');
const logger = require("./logger").forType("Interaction");

/**
 * Used to manage messages and responses to users.
 */
class Interaction {
    /**
     * @param  {Robot} robot- The hubot robot.
     * @param  {Response} botResponse - The response channel.
     * @param  {SlackAdapterService} [slackAdapter] - The slack adapter
     */
    constructor(robot, botResponse, slackAdapter) {
        this._botResponse = botResponse;
        this._robot = robot;
        this._conversation = Session.instance.conversation;
        this._slackAdapter = util.getValueOrDefault(slackAdapter, Session.instance.slackAdapter);
    }

    /**
     * Finds the {@link User} for the given userName.
     *
     * @param userName - The user name.
     * @returns {User} - The found user.
     */
    userForName(userName) {
        return this._robot.brain.userForName(userName);
    }

    /**
     * Impersonates the given user.
     *
     * @param user {User} - the user to impersonate
     */
    impersonate(user) {
        this._botResponse.message.user = user;
        this._botResponse.envelope.user = user;
    }

    /**
     * Determines whether a message is directed at the bot.
     *
     * @return {boolean} - True if directed at the bot; false otherwise.
     */
    get isInteractingWithBot() {
        return this.isReactionToBot || this.isReprocess || this.isInteractingDirectlyWithBot || this.hasOpenDialog;
    }

    /**
     * Determines whether a message has been sent directly to the bot (@ mentioned).
     *
     * @return {boolean} - True if talking directly to the bot; false otherwise.
     */
    get isInteractingDirectlyWithBot() {
        return util.isNotNullOrEmpty(this._botResponse.message.text) && new RegExp("^\\s*@?" + this._robot.name).test(this._botResponse.message.text);
    }

    /**
     * @return {boolean} - True if the interaction is a reaction to one of the bot's messages
     */
    get isReactionToBot() {
        return this._slackAdapter.isReaction(this._botResponse.message);
    }

    /**
     * @return {Reaction|null}
     */
    get reaction() {
        if (!this.isReactionToBot) {
            return null;
        }
        let reactionMessage = this._botResponse.message;
        return new Reaction(reactionMessage.type, reactionMessage.reaction, reactionMessage.item);
    }

    /**
     * @return {boolean} - True if this is a reprocessed message; false otherwise.
     */
    get isReprocess() {
        return this._botResponse.message.isReprocess === true;
    }

    /**
     * @return {string}
     */
    get requestText() {
        if (util.isNullOrEmpty(this._requestText) && util.isNotNullOrEmpty(this._botResponse.message.text)) {
            return this._botResponse.message.text.replace(this._robot.respondPattern(/(.*)/), "$1");
        } else {
            return this._requestText;
        }
    }

    /**
     * Updates the request text.
     *
     * @param updatedText {string}
     */
    set requestText(updatedText) {
        this._requestText = updatedText;
    }

    /**
     * @return {string} - The room the message was sent to
     */
    get requestRoom() {
        if (util.isNotNullOrEmpty(this._botResponse) && util.isNotNullOrEmpty(this._botResponse.message) && util.isNotNullOrEmpty(this._botResponse.message.room)) {
            return this._botResponse.message.room;
        }
        return "";
    }

    /**
     * @return {string}
     */
    get requestRoomType() {
        return this._slackAdapter.determineRoomType(this.requestRoom);
    }

    /**
     * @returns {User}
     */
    get user() {
        return this._botResponse.message.user;
    }

    /**
     * Finds the user object for the named user.
     *
     * @param {string} name - The name of the user.
     */
    findUserForName(name) {
        return this._robot.brain.userForName(name);
    }

    /**
     * @returns {string}
     */
    get userId() {
        return this._botResponse.message.user.id;
    }

    /**
     * @return {Dialog}
     */
    get currentDialog() {
        return this._conversation.retrieveDialog(this);
    }

    /**
     * @return {boolean}
     */
    get hasOpenDialog() {
        return util.isNotNullOrEmpty(this._conversation.retrieveDialog(this));
    }

    /**
     * @return {boolean}
     */
    get isThreaded() {
        return util.isNotNullOrEmpty(this._botResponse.message.thread_ts);
    }

    /**
     * Returns true if this channel is a direct message.
     * @returns {boolean} - True if DM; false otherwise.
     */
    get isDirectMessage() {
        return this._slackAdapter.isDirectMessage(this.requestRoom);
    }

    /**
     * Creates or retrieves the thread identifier.
     *
     * @return {string}
     */
    get threadIdentifier() {
        return this._slackAdapter.retrieveThreadIdentifierForMessage(this._botResponse.message);
    }

    /**
     * Retrieves the event timestamp for this interaction.
     *
     * @return {string}
     */
    get eventTimestamp() {
        return this._slackAdapter.retrieveEventTimestampForMessage(this._botResponse.message);
    }

    /**
     * Adds a reaction to this interaction.
     *
     * @param {string} reaction - the reaction to apply
     */
    async react(reaction) {
        await this._slackAdapter.addReaction(this, reaction);
    }

    /**
     * Reprocesses the message with the current value of {@link requestText}
     */
    reprocess() {
        this._botResponse.message.isReprocess = true;
        this._botResponse.message.text = this.requestText;
        this._robot.receive(this._botResponse.message);
    }

    /**
     * Sends the given content as a snippet with the given filename.
     *
     * @param fileName {string} - The "filename" to be displayed to the user.
     * @param content {string} - The content of the snippet
     * @param comment {string} - Optional comment
     */
    sendSnippet(fileName, content, comment) {
        if (this._slackAdapter.isAvailable) {
            this._slackAdapter.sendSnippet(this, fileName, content, comment);
        } else {
            this.reply(content);
        }
    }

    /**
     * Sends the given base64Content as a file with the given filename.
     *
     * @param  {string} fileName - The "filename" to be displayed to the user.
     * @param  {string} filePath - The name of the file
     * @param  {string} [comment] - Optional comment
     */
    async uploadFile(fileName, filePath, comment) {
        if (this._slackAdapter.isAvailable) {
            await this._slackAdapter.uploadFile(this, fileName, filePath, comment);
        } else {
            this.reply(filePath);
        }
    }

    /**
     * Sends the text.
     *
     * @param text {string}
     */
    reply(text) {
        this.replyInThread(text);
    }

    /**
     * Replies directly to the the user for which the response was created.
     *
     * @param text {string}  - The text to reply with
     */
    replyDirect(text) {
        logger.debug(`Replying directly to ${this.userId}"`);
        this._robot.messageRoom(this.userId, text);
    }

    /**
     * Replies to the user in a thread.
     *
     * @param text {string}  - The text to reply with
     */
    replyInThread(text) {
        this._botResponse.message.thread_ts = this.threadIdentifier;
        this._botResponse.reply(text);
    }

    /**
     * Opens a dialog on the current {@link Interaction}.  If a dialog already exists, it will be returned.
     *
     * @returns {Dialog}
     */
    openDialog() {
        return this._conversation.openDialog(this);
    }

    /**
     * Ends an open dialog with the current user if one exists.
     */
    endDialog() {
        if (this.hasOpenDialog) {
            this.currentDialog.close();
        }
    }

    /**
     * Resets the current dialog if one exists.
     */
    resetDialog() {
        if (this.hasOpenDialog) {
            this.currentDialog.reset();
        }
    }

    /**
     * Clones this interaction.
     * @returns {Interaction}
     */
    clone() {
        // We need to clone the response but not lose the cached connection.  So we'll just clone part of the response.
        let cloneResponse = new Response(this._robot, cloneDeep(this._botResponse.message), cloneDeep(this._botResponse.match));
        return new Interaction(this._robot, cloneResponse);
    }

    /**
     * Creates a new {@link Interaction} from the given response.
     *
     * @param botResponse {Response}
     * @returns {Interaction}
     */
    static from(botResponse) {
        return new Interaction(botResponse.robot, botResponse);
    }
}

module.exports = Interaction;
