'use strict';

const {describe, it, beforeEach, afterEach} = require('mocha');
const {expect} = require('chai');


require("coffee-script");
const CommandRepository = require("../scripts/lib/command-repository");
const UnsolicitedCommand = require("../scripts/lib/unsolicited-command");
const {beforeTest, afterTest, sinon} = require("./shared");
const {ReactionMessage} = require('hubot-slack/src/message');
const {User, TextMessage} = require('hubot');

describe('Main Bot', () => {
    beforeEach(() => beforeTest.apply(this));
    afterEach(() => afterTest.apply(this));

    it("should ignore requests with newline", () => {
        return this.room.user
                   .say("bot_user", "@hubot dig\n some.host.name")
                   .then(() => {
                       expect(this.room.messages.length).to.equal(1);
                       expect(this.room.messages).to.eql([
                           ["bot_user", "@hubot dig\n some.host.name"]
                       ]);
                   })
    });

    it("should find command for reaction message", () => {
        let captured = {};
        sinon.stub(CommandRepository.prototype, 'findCommandsFor').callsFake((interaction) => captured.interaction = interaction);
        let reactionMessage = new ReactionMessage("added", {room: "x"}, "reaction", {name: this.room.robot.name});
        return new Promise((resolve) => this.room.robot.receive(reactionMessage, resolve))
            .then(() => {
                expect(captured.interaction.reaction.type).to.eql("added");
                expect(captured.interaction.reaction.reaction).to.eql("reaction");
                expect(captured.interaction.reaction.item).to.eql(undefined);
            })
    });

    it("should listen for unsolicited command triggers", () => {
        sinon.stub(CommandRepository.prototype, 'findUnsolicitedCommandsFor').callsFake(() => [TestUnsolicitedCommand]);
        return this.room.user
                   .say("bot_user", "some text")
                   .then(() => {
                       expect(this.room.messages).to.eql([
                           ["bot_user", "some text"],
                           ["hubot", "@bot_user Unsolicited Response"]
                       ]);
                   })
    });

    it("should not listen for unsolicited command triggers in threaded messages", () => {
        sinon.stub(CommandRepository.prototype, 'findUnsolicitedCommandsFor').callsFake(() => [TestUnsolicitedCommand]);

        // Create a threaded message
        const user = new User("bot_user", {room: this.room.name});
        const textMessage = new TextMessage(user, "some text");
        textMessage.thread_ts = 12012012;

        return this.room.user
                   .say("bot_user", textMessage)
                   .then(() => {
                       expect(this.room.messages).to.eql([
                           ["bot_user", "some text"]
                       ]);
                   })
    });

    class TestUnsolicitedCommand extends UnsolicitedCommand {
        async execute(interaction) {
            interaction.reply("Unsolicited Response")
        }
    }
});
