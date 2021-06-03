'use strict';

const {describe, it, beforeEach, afterEach} = require('mocha');
const {expect} = require('chai');

const {beforeTest, afterTest, sinon, responses} = require("./shared");
const {AuthorizationService} = require("../scripts/lib");
const {User} = require("hubot");

describe('ForUser Command', () => {
    beforeEach(() => {
        beforeTest.apply(this);
        // Assume the user has access to all commands for these tests
        sinon.stub(AuthorizationService.prototype, "hasAccess").returns(true);
    });
    afterEach(() => afterTest.apply(this));

    it("should delegate command execution to specified user", () => {
        sinon.stub(this.room.robot.brain, "userForName").returns(new User("delegate_id", {name: "delegate"}));
        return this.room.user.say("bot_user", "@hubot for @delegate help")
                   .then(() => {
                       expect(this.room.messages).to.eql([
                           ["bot_user", "@hubot for @delegate help"],
                           ["hubot", "@delegate " + responses.help.menu]
                       ]);
                       expect(this.response.message.user.id).to.equal("delegate_id", "The message should be owned by the delegate now");
                   });
    });

    it("should respond to the delegate user", () => {
        sinon.stub(this.room.robot.brain, "userForName").returns(new User("delegate_id", {name: "delegate"}));
        return this.room.user.say("bot_user", "@hubot for @delegate help")
                   .then(() => {
                       return this.room.user.say("delegate_id", "1")
                                  .then(() => {
                                      expect(this.room.messages).to.have.lengthOf(4, "The bot should have responded to the delegate");
                                  });
                   });
    });

    it("should not respond to the requesting user", () => {
        sinon.stub(this.room.robot.brain, "userForName").returns(new User("delegate_id", {name: "delegate"}));
        return this.room.user.say("bot_user", "@hubot for @delegate help")
                   .then(() => {
                       return this.room.user.say("bot_user", "1")
                                  .then(() => {
                                      expect(this.room.messages).to.have.lengthOf(3, "The bot should not have responded to the requester");
                                  });
                   });
    });

});
