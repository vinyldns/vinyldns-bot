'use strict';

const {describe, it, beforeEach} = require('mocha');
const {expect} = require('chai');

const {MockInteraction, sinon, responses, beforeTest, afterTest} = require("./shared");
const CommandUsageCommand = require("../scripts/commands/command-usage-command");
const {Session, AuthorizationService} = require("../scripts/lib");

describe('Command Usage Command', () => {
    beforeEach(() => {
        beforeTest();
        Session.instance.authService = new AuthorizationService();
    });
    afterEach(() => afterTest());

    it("should return commands public commands to unauthorized user", () => {
        let mockInteraction = new MockInteraction().withUserId("test_user");
        new CommandUsageCommand(null, null).execute(mockInteraction);

        expect(mockInteraction.responses).to.eql([responses.usage.public_commands()]);
    });

    it("should return public commands to admin in non DM", () => {
        sinon.stub(AuthorizationService.prototype, "hasAccess").returns(true);
        let mockInteraction = new MockInteraction().withUserId("test_user");
        mockInteraction.isDirectMessage = false;
        new CommandUsageCommand(null, null).execute(mockInteraction);
        expect(mockInteraction.responses).to.eql([responses.usage.public_commands()]);
    });

    it("should return all commands to admin in DM", () => {
        sinon.stub(AuthorizationService.prototype, "hasAccess").returns(true);
        let mockInteraction = new MockInteraction().withUserId("test_user");
        mockInteraction.isDirectMessage = true;
        new CommandUsageCommand(null, null).execute(mockInteraction);
        expect(mockInteraction.responses).to.eql([responses.usage.all_commands()]);
    });
});