'use strict';

require("coffeescript/register");
const {ReactionMessage} = require('hubot-slack/src/message');
const {describe, it} = require('mocha');
const {expect} = require('chai');

const {SlackAdapterService} = require("../scripts/lib");
const {sinon} = require("./shared");

describe('Slack Adapter Service', () => {
    it("should be available if client is present in adapter", () => {
        let service = new SlackAdapterService({client: {}});
        expect(service.isAvailable).to.equal(true);
    });

    it("should be unavailable if client is not present", () => {
        let service = new SlackAdapterService({});
        expect(service.isAvailable).to.equal(false);
    });

    it("should perform file upload on send snippet", () => {
        let uploadFile = null;
        let uploadParams = null;
        let service = new SlackAdapterService({
            client: {
                web: {
                    files: {
                        upload: (fileName, params) => {
                            uploadFile = fileName;
                            uploadParams = params;
                        }
                    }
                }
            }
        });
        service.sendSnippet({threadIdentifier: "thread", requestRoom: "room"}, "filename", "content", "comment");
        expect(uploadFile).to.equal("filename");
        expect(uploadParams).to.eql({
            thread_ts: "thread",
            content: "content",
            channels: "room",
            initial_comment: "comment"
        });
    });


    it("should perform file upload on uploadFile", () => {
        let uploadFile = null;
        let uploadParams = null;
        let service = new SlackAdapterService({
            client: {
                web: {
                    files: {
                        upload: (fileName, params) => {
                            uploadFile = fileName;
                            uploadParams = params;
                        }
                    }
                }
            }
        });
        let fs = require('fs');
        sinon.stub(fs, 'createReadStream').callsFake(() => Buffer.from("test"));
        service.uploadFile({threadIdentifier: "thread", requestRoom: "room"}, "filename", "content", "comment");
        expect(uploadParams).to.eql({
            channels: "room",
            file: Buffer.from("test"),
            initial_comment: "comment",
            thread_ts: "thread",
        });
    });

    it("should return true for isReaction if reaction to one of the robot's messages", () => {
        let service = new SlackAdapterService({robot: {name: "bot"}});
        let reactionMessage = new ReactionMessage("type", {room: "x"});
        reactionMessage.item_user = {name: "bot"};
        expect(service.isReaction(reactionMessage)).to.equal(true);
    });

    it("should return false for isReaction if reaction to a non-bot message", () => {
        let service = new SlackAdapterService({robot: {name: "bot"}});
        let reactionMessage = new ReactionMessage("type", {room: "x"});
        reactionMessage.item_user = {name: "non-bot"};
        expect(service.isReaction(reactionMessage)).to.equal(false);
    });

    it("should call delete api on message delete", () => {
        let captured = {};
        let service = new SlackAdapterService({
            client: {
                web: {
                    chat: {
                        delete: (timestamp, channel, params) => {
                            captured.timestamp = timestamp;
                            captured.channel = channel;
                            captured.params = params;
                            return new Promise(resolve => resolve());
                        }
                    }
                }
            }
        });
        service.deleteMessage("timestamp", "channel");
        expect(captured).to.eql({
            channel: "channel",
            params: undefined,
            timestamp: "timestamp",
        });
    });

    it("should indicate direct message if room begins with D", () => {
        let service = new SlackAdapterService({});
        expect(service.isDirectMessage("DUSI393838")).to.equal(true);
    });

    it("should indicate not direct message if room does not begin with D", () => {
        let service = new SlackAdapterService({});
        expect(service.isDirectMessage("CUSYUD837")).to.equal(false);
    });

    it("should determine room type as CHANNEL if room starts with C", () => {
        let service = new SlackAdapterService({});
        expect(service.determineRoomType("CUSYUD837")).to.equal("CHANNEL");
    });

    it("should determine room type as DIRECT if room starts with D", () => {
        let service = new SlackAdapterService({});
        expect(service.determineRoomType("DUSYUD837")).to.equal("DIRECT");
    });

    it("should pass through room type if not known", () => {
        let service = new SlackAdapterService({});
        expect(service.determineRoomType("xxx")).to.equal("xxx");
    });

    it("should return thread identifier based on timestamp if thread_ts present", () => {
        expect(new SlackAdapterService({}).retrieveThreadIdentifierForMessage({thread_ts: "xxx"})).to.equal("xxx");
    });

    it("should return thread identifier based on timestamp if rawMessage timestamp present", () => {
        expect(new SlackAdapterService({}).retrieveThreadIdentifierForMessage({rawMessage: {ts: "xxx"}})).to.equal("xxx");
    });

    it("should return default thread identifier if no timestamp present", () => {
        expect(new SlackAdapterService({}).retrieveThreadIdentifierForMessage({})).to.equal("0");
    });
});
