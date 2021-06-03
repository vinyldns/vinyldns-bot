'use strict';

const {describe, it, beforeEach, afterEach} = require('mocha');
const {expect} = require('chai');

const {beforeTest, afterTest, sinon} = require("./shared");
const {OutputChannel} = require("../scripts/lib");

describe('Output Channel', () => {
    beforeEach(() => beforeTest.apply(this));
    afterEach(() => afterTest.apply(this));

    it("should send messsage to room", () => {
        new OutputChannel(this.room.robot).sendMessage("some_room", "sample message to be sent");
        expect(this.room.robot.messagesTo).to.eql({
            "some_room": [
                ["hubot", "sample message to be sent"]
            ]
        });
    });

});