'use strict';

const {describe, it, beforeEach, afterEach} = require('mocha');
const {expect} = require('chai');

const {beforeTest, afterTest, sinon} = require("./shared");
const {VinylDnsService} = require("../scripts/lib");

describe('Record Owner Command', () => {
    beforeEach(() => beforeTest.apply(this));
    afterEach(() => afterTest.apply(this));


    it("should return unowned if no owner is found", () => {
        sinon.stub(VinylDnsService.prototype, "findOwnerByFqdn").returns({errors: [], isSharedZone: false, ownerGroup: {name: "Some Group", email: "some_group@foo.com"}});
        return this.room.user
                   .say("bot_user", "@hubot owner some.host.name")
                   .then(() => {
                       expect(this.room.messages).to.eql([
                           ["bot_user", "@hubot owner some.host.name"],
                           ["hubot", "@bot_user The record `some.host.name` is currently *Unowned*."]
                       ]);
                   })
    });

    it("should return owner information if owner is found", () => {
        sinon.stub(VinylDnsService.prototype, "findOwnerByFqdn").returns({errors: [], hasOwner: true, isSharedZone: false, ownerGroup: {name: "Some Group", email: "some_group@foo.com"}});
        return this.room.user
                   .say("bot_user", "@hubot owner some.host.name")
                   .then(() => {
                       expect(this.room.messages).to.eql([
                           ["bot_user", "@hubot owner some.host.name"],
                           ["hubot", "@bot_user Here is the owner information for `some.host.name`:\n\n>*Group*\n>    👥 Some Group\n>*Email*\n>    📫 some_group@foo.com"]
                       ]);
                   })
    });

    it("should shared zone message if shared zone", () => {
        sinon.stub(VinylDnsService.prototype, "findOwnerByFqdn").returns({errors: [], isSharedZone: true, ownerGroup: {name: "Some Group", email: "some_group@foo.com"}});
        return this.room.user
                   .say("bot_user", "@hubot owner some.host.name")
                   .then(() => {
                       expect(this.room.messages).to.eql([
                           ["bot_user", "@hubot owner some.host.name"],
                           ["hubot", "@bot_user `some.host.name` is a shared zone.  There is no owner information to provide."]
                       ]);
                   })
    });

    it("should send error if error occurred", () => {
        sinon.stub(VinylDnsService.prototype, "findOwnerByFqdn").returns({errors: ["No zone found"], isSharedZone: false, ownerGroup: {name: "Some Group", email: "some_group@foo.com"}});
        return this.room.user
                   .say("bot_user", "@hubot owner some.host.name")
                   .then(() => {
                       expect(this.room.messages).to.eql([
                           ["bot_user", "@hubot owner some.host.name"],
                           ["hubot", "@bot_user Sorry, no zone found"]
                       ]);
                   })
    });
});
