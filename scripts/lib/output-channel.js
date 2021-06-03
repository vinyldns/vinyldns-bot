'use strict';

class OutputChannel {
    /**
     * @param robot {Robot} - The hubot reference
     */
    constructor(robot) {
        this._robot = robot;
    }

    /**
     * Sends the given message to the given channel.
     *
     * @param channel {string} - The channel to which to send the message
     * @param message {string} - The message to send to the channel.
     */
    sendMessage(channel, message) {
        this._robot.messageRoom(channel, message);
    }
}

module.exports = OutputChannel;