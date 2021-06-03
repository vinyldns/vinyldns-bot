'use strict';

const {describe, it, beforeEach, afterEach} = require('mocha');
const {expect} = require('chai');

const {beforeTest, afterTest, expectNoMatchReply, sinon, responses} = require("./shared");
const {Interaction, AuthorizationService} = require("../scripts/lib");


describe('Stat Command', () => {
    beforeEach(() => beforeTest.apply(this));
    afterEach(() => afterTest.apply(this));

    it("should return version in DM if authorized", () => {
        sinon.stub(AuthorizationService.prototype, "hasAccess").returns(true);
        let replyDirect = sinon.spy(Interaction.prototype, "replyDirect");
        return this.room.user
                   .say("bot_user", "@hubot stat")
                   .then(() => {
                       expect(replyDirect.calledOnce).to.equal(true, "Should have replied directly to the user");
                       expect(replyDirect.args).to.have.length(1);
                       expect(replyDirect.args[0]).to.eql(["Version: 1.0"]);
                   })
    });
    it("should do nothing if not authorized", () => {
        sinon.stub(AuthorizationService.prototype, "hasAccess").returns(false);
        let replyDirect = sinon.spy(Interaction.prototype, "replyDirect");
        return this.room.user
                   .say("bot_user", "@hubot stat")
                   .then(() => {
                       expect(replyDirect.calledOnce).to.equal(false, "Should not be called; not authorized");
                       expectNoMatchReply(this.room, "stat");
                   })
    });
});