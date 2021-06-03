'use strict';

const {describe, it, beforeEach, afterEach} = require('mocha');
const {expect} = require('chai');

const {beforeTest, afterTest, expectNoMatchReply, sinon} = require("./shared");
const {Interaction, AuthorizationService, ConversationService} = require("../scripts/lib");


describe('Reset Command', () => {
    beforeEach(() => beforeTest.apply(this));
    afterEach(() => afterTest.apply(this));

    it("should indicate how many dialogs were reset", async () => {
        sinon.stub(AuthorizationService.prototype, "hasAccess").returns(true);
        sinon.stub(ConversationService.prototype, "numOpenDialogs").get(() => 1);
        let replyDirect = sinon.spy(Interaction.prototype, "replyDirect");
        return this.room.user
                   .say("bot_user", "@hubot reset")
                   .then(() => {
                       expect(replyDirect.called).to.equal(true, "Should have replied directly to the user");
                       expect(replyDirect.args).to.eql([
                           ["Resetting 1 open dialogs.."]
                       ]);
                   })
    });

    it("should indicate no dialogs available", () => {
        sinon.stub(AuthorizationService.prototype, "hasAccess").returns(true);
        sinon.stub(ConversationService.prototype, "numOpenDialogs").get(() => 0);
        let replyDirect = sinon.spy(Interaction.prototype, "replyDirect");
        return this.room.user
                   .say("bot_user", "@hubot reset")
                   .then(() => {
                       expect(replyDirect.called).to.equal(true, "Should have replied directly to the user");
                       expect(replyDirect.args).to.eql([
                           ["No dialogs currently open"]
                       ]);
                   })
    });

    it("should indicate no dialogs available for user", () => {
        sinon.stub(AuthorizationService.prototype, "hasAccess").returns(true);
        sinon.stub(ConversationService.prototype, "numOpenDialogs").get(() => 10);
        sinon.stub(ConversationService.prototype, "numOpenDialogsFor").callsFake(() => 0);
        sinon.stub(Interaction.prototype, "findUserForName").callsFake(() => {
            return {
                id: "user_id",
                name: "user_name"
            }
        });
        let replyDirect = sinon.spy(Interaction.prototype, "replyDirect");
        return this.room.user
                   .say("bot_user", "@hubot reset @user")
                   .then(() => {
                       expect(replyDirect.called).to.equal(true, "Should have replied directly to the user");
                       expect(replyDirect.args).to.eql([
                           ["No dialogs currently open with `@user_name`"]
                       ]);
                   })
    });

    it("should indicate number of dialogs close for user", () => {
        sinon.stub(AuthorizationService.prototype, "hasAccess").returns(true);
        sinon.stub(ConversationService.prototype, "numOpenDialogs").get(() => 10);
        sinon.stub(ConversationService.prototype, "numOpenDialogsFor").callsFake(() => 1);
        sinon.stub(Interaction.prototype, "findUserForName").callsFake(() => {
            return {
                id: "user_id",
                name: "user_name"
            }
        });
        let replyDirect = sinon.spy(Interaction.prototype, "replyDirect");
        return this.room.user
                   .say("bot_user", "@hubot reset @user")
                   .then(() => {
                       expect(replyDirect.called).to.equal(true, "Should have replied directly to the user");
                       expect(replyDirect.args).to.eql([
                           ["Resetting 1 dialogs for `@user_name`"]
                       ]);
                   })
    });

    it("should indicate user not found", () => {
        sinon.stub(AuthorizationService.prototype, "hasAccess").returns(true);
        sinon.stub(ConversationService.prototype, "numOpenDialogs").get(() => 10);
        sinon.stub(ConversationService.prototype, "numOpenDialogsFor").callsFake(() => 1);
        sinon.stub(Interaction.prototype, "findUserForName").callsFake(() => {
            return undefined;
        });
        let replyDirect = sinon.spy(Interaction.prototype, "replyDirect");
        return this.room.user
                   .say("bot_user", "@hubot reset @user")
                   .then(() => {
                       expect(replyDirect.called).to.equal(true, "Should have replied directly to the user");
                       expect(replyDirect.args).to.eql([
                           ["Cannot find user with name `@user`"]
                       ]);
                   })
    });

    it("should do nothing if not authorized", () => {
        sinon.stub(AuthorizationService.prototype, "hasAccess").returns(false);
        let replyDirect = sinon.spy(Interaction.prototype, "replyDirect");
        return this.room.user
                   .say("bot_user", "@hubot reset")
                   .then(() => {
                       expect(replyDirect.calledOnce).to.equal(false, "Should not be called; not authorized");
                       expectNoMatchReply(this.room, "reset");
                   })
    });
});
