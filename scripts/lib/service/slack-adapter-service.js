'use strict';

require("coffeescript/register");
const fs = require('fs');
const util = require("../../lib/util");
const {ReactionMessage} = require('hubot-slack/src/message');
const logger = require("../logger").forType("SlackAdapterService");

/**
 * Service for interacting with slack
 */
class SlackAdapterService {
    /**
     * @param adapter {Adapter}
     */
    constructor(adapter) {
        this._adapter = adapter;
        if (this.isAvailable) {
            this._interceptSlackApiCalls(this._adapter.client);
        }
    }

    /**
     * @return {boolean} - Returns true if the slack adapter is available; false otherwise.
     */
    get isAvailable() {
        return util.isNotNullOrEmpty(this._adapter.client);
    }

    /**
     * Sends a snippet
     *
     * @param interaction {Interaction}
     * @param fileName {string}
     * @param content {string}
     * @param comment {string}
     */
    sendSnippet(interaction, fileName, content, comment) {
        this._adapter.client.web.files.upload(fileName, {
            thread_ts: interaction.threadIdentifier,
            content: content,
            channels: interaction.requestRoom,
            initial_comment: comment
        });
    }

    /**
     * Upload file
     *
     * @param interaction {Interaction}
     * @param fileName {string}
     * @param filePath {string}
     * @param comment {string}
     */
    async uploadFile(interaction, fileName, filePath, comment) {
        let stream = fs.createReadStream(filePath);
        try {
            await this._adapter.client.web.files.upload(fileName, {
                thread_ts: interaction.threadIdentifier,
                file: stream,
                channels: interaction.requestRoom,
                initial_comment: comment
            });
        } finally {
            if (util.isNotNullOrEmpty(stream.close)) {
                stream.close();
            }
        }
    }

    /**
     * Adds a reaction to the given interaction.
     *
     * @param {Interaction} interaction
     * @param {string} [reaction="thumbsup"]
     * @returns {Promise<void>}
     */
    async addReaction(interaction, reaction) {
        if (util.isNullOrEmpty(reaction)) {
            reaction = "thumbsup"
        }
        await this._adapter.client.web.reactions.add(reaction, {
            timestamp: interaction.eventTimestamp,
            channel: interaction.requestRoom,
        });
    }

    /**
     * Determines if the given message is a reaction.
     *
     * @param message {Message} - The message
     * @return {boolean} - Returns true if the given message is a reaction; false otherwise.
     */
    isReaction(message) {
        return message instanceof ReactionMessage && message.item_user.name === this._adapter.robot.name;
    }

    /**
     * Deletes a message with the given timestamp in the given channel.
     *
     * @param timestamp {string} - The message timestamp.
     * @param channel {string} - The message channel.
     */
    deleteMessage(timestamp, channel) {
        this._adapter.client.web.chat
            .delete(timestamp, channel)
            .catch((error) => {
                logger.error("Error deleting message", error);
            });
    }

    /**
     * Determines if the given room represents a direct message.
     *
     * @param room {string} - The room/channel.
     * @return {boolean} - True if the "room" is a direct message; false otherwise.
     */
    isDirectMessage(room) {
        return room[0] === 'D';
    }

    /**
     * Determines the room type for the given room name.
     *
     * @param roomName {string} - The name of the room.
     * @return {string} - DIRECT if the room is a direct message, CHANNEL if the room is a channel; the room name otherwise.
     */
    determineRoomType(roomName) {
        if (roomName[0] === 'D') {
            // This is a direct message
            return "DIRECT";
        }
        if (roomName[0] === 'C') {
            // This is a channel message
            return "CHANNEL";
        }
        return roomName;
    }

    /**
     * Retrieves the thread identifier for the given message.
     *
     * @param message {Message} - The message
     * @return {string} - The thread id.
     */
    retrieveThreadIdentifierForMessage(message) {
        if (util.isNotNullOrEmpty(message.thread_ts)) {
            return message.thread_ts;
        } else {
            if (util.isNotNullOrEmpty(message.rawMessage)) {
                return message.rawMessage.ts;
            } else {
                return "0";
            }
        }
    }

    /**
     * Retrieves the event timestamp for the given message.
     *
     * @param message {Message} - The message
     * @return {string} - The thread id.
     */
    retrieveEventTimestampForMessage(message) {
        if (util.isNotNullOrEmpty(message.rawMessage)) {
            return message.rawMessage.ts;
        } else {
            if (util.isNotNullOrEmpty(message.thread_ts)) {
                return message.thread_ts;
            }
        }
        return "0";
    }

    _interceptSlackApiCalls(client) {
        if (util.isNullOrEmpty(client) || util.isNullOrEmpty(client.web) || util.isNullOrEmpty(client.web.chat)) {
            return;
        }
        if (util.isNullOrEmpty(client.web.chat._postMessageIntercept)) {
            client.web.chat._postMessageIntercept = client.web.chat.postMessage;
        }
        client.web.chat.postMessage = (channel, text, opts, optCb) => {
            opts.unfurl_links = false; // Disable unfurling of links
            return client.web.chat._postMessageIntercept.call(client.web.chat, channel, text, opts, optCb);
        }
    }
}

module.exports = SlackAdapterService;
