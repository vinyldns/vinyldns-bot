'use strict';

const {describe, it, beforeEach, afterEach} = require('mocha');
const {expect} = require('chai');

const {beforeTest, afterTest, sinon} = require("./shared");
const {Interaction, DigService} = require("../scripts/lib");

describe('Dig Command', () => {
    beforeEach(() => {
        beforeTest.apply(this);
        sinon.stub(DigService.prototype, 'performLookup').callsFake((a, b) => new Promise(resolve => resolve(`>> sample dig response - host: '${a}'; type: '${b}'`)));
    });
    afterEach(() => afterTest.apply(this));

    it("should return dig results via sendSnippet", () => {
        let sendSnippet = sinon.spy(Interaction.prototype, 'sendSnippet');
        return this.room.user
                   .say("bot_user", "@hubot dig some.host.name")
                   .then(() => {
                       expect(sendSnippet.calledOnce).to.equal(true, "sendSnippet should be called to send the dig results");
                   })
    });

    it("should default to A record types", () => {
        return this.room.user
                   .say("bot_user", "@hubot dig some.host.name")
                   .then(() => {
                       expect(this.room.messages).to.eql([
                           ["bot_user", "@hubot dig some.host.name"],
                           ["hubot", "@bot_user >> sample dig response - host: 'some.host.name'; type: 'A'"]
                       ]);
                   })
    });

    it("should allow type to be specified", () => {
        return this.room.user
                   .say("bot_user", "@hubot dig some.host.name CNAME")
                   .then(() => {
                       expect(this.room.messages).to.eql([
                           ["bot_user", "@hubot dig some.host.name CNAME"],
                           ["hubot", "@bot_user >> sample dig response - host: 'some.host.name'; type: 'CNAME'"]
                       ]);
                   })
    });

    it("should accept AAAA requests and not stop on the first A in the regex", () => {
        return this.room.user
                   .say("bot_user", "@hubot dig some.host.name AAAA")
                   .then(() => {
                       expect(this.room.messages).to.eql([
                           ["bot_user", "@hubot dig some.host.name AAAA"],
                           ["hubot", "@bot_user >> sample dig response - host: 'some.host.name'; type: 'AAAA'"]
                       ]);
                   })
    });
});
