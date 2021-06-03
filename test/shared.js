const Helper = require('hubot-test-helper');
const {TextMessage} = require('hubot/es2015');
const helper = new Helper('../scripts/main.js');
const {Session, SchedulerService, Interaction, CommandRepository} = require('../scripts/lib');
const sinon = require('sinon');
const {expect} = require('chai');

const dns_change_faqs = require('../scripts/resources/dns-change-faqs');
const access_faqs = require('../scripts/resources/access-faqs');
const delegation_faqs = require('../scripts/resources/delegation-faqs');
const zone_faqs = require('../scripts/resources/zone-connection-faqs');
const AuthorizationService = require("../scripts/lib/service/authorization-service");

function faqFormat(faqItems) {
    let faq_suffix = "\n\nPlease reply with a corresponding number. Use `back`, `home` or `help` to go back; `cancel` to end.";
    if (faqItems.length === 1) {
        faq_suffix = "\n\nUse `back`, `home` or `help` to go back; `cancel` to end.";
    }
    return faqItems.map((x, i) => `   \`${i + 1}\` ${x.question}`).join("\n") + faq_suffix;
}

const responses = {
    help: {
        menu: "What can I help you with?\n" +
              "  `1` Available hubot `commands`\n" +
              "  `2` DNS `changes`\n" +
              "  `3` `Access` and credentials\n" +
              "  `4` DNS `delegations` (such as AWS Route 53)\n" +
              "  `5` `Zone` connections/errors\n\n" +
              "Reply with a `number` or one of the `highlighted` words. To search type `search <search terms>`.",
        build_command_usage: () => "\n" + Object.values(require('../scripts/commands'))
                                                .map(x => new x())
                                                .map(x => x.descriptor.toHelpString())
                                                .join("\n") + "\n\n" + "Use `back`, `home` or `help` to go back; `cancel` to end."
    },
    usage: {
        all_commands: () => "\n" + new CommandRepository().allRootCommands
                                                          .map(x => new x())
                                                          .filter(x => x.descriptor)
                                                          .map(x => x.descriptor.toHelpString())
                                                          .join("\n") + "\n\n" + "Use `back`, `home` or `help` to go back; `cancel` to end.",
        public_commands: () => "\n" + new CommandRepository().allRootCommands
                                                             .filter(x => !new AuthorizationService().isRestricted(x.name))
                                                             .map(x => new x())
                                                             .filter(x => x.descriptor)
                                                             .map(x => x.descriptor.toHelpString())
                                                             .join("\n") + "\n\n" + "Use `back`, `home` or `help` to go back; `cancel` to end.",
    },
    faq: {
        items: {
            zone_faqs: zone_faqs.faqItems,
            delegation_faqs: delegation_faqs.faqItems,
            access_faqs: access_faqs.faqItems,
            dns_change_faqs: dns_change_faqs.faqItems
        },
        zones: "Here are questions corresponding to zones:\n" + faqFormat(zone_faqs.faqItems),
        delegation: "Here are questions corresponding to DNS delegation:\n" + faqFormat(delegation_faqs.faqItems),
        access: "Here are questions corresponding to access and credentials:\n" + faqFormat(access_faqs.faqItems),
        changes: "Here are questions corresponding to changes:\n" + faqFormat(dns_change_faqs.faqItems)
    },
    for: {
        /**
         * @param command {string}
         * @return {string}
         */
        header: (command) => "In the future, you can simply type `@hubot " + command + "` to get this answer yourself!"
    },
    search: {
        prefix: "The following questions matched:\n",
        suffix: "\n\nUse `back`, `home` or `help` to go back; `cancel` to end.",
    }
};

class MockInteraction extends Interaction {
    constructor() {
        super(null, null);
    }

    get userId() {
        return this._userId;
    }

    set isDirectMessage(value) {
        this._isDirectMessage = value;
    }

    get isDirectMessage() {
        return this._isDirectMessage;
    }

    /**
     * @param userId {string}
     * @returns {MockInteraction}
     */
    withUserId(userId) {
        this._userId = userId;
        return this;
    }

    /**
     * @returns {string[]}
     */
    get responses() {
        this._responses = this._responses || [];
        return this._responses;
    }

    /**
     * @param text [string]
     */
    set responses(text) {
        this._responses = text;
    }

    reply(text) {
        this.responses.push(text);
    }
}

module.exports = {
    MockInteraction: MockInteraction,
    sinon: sinon,
    beforeTest: function () {
        this.room = helper.createRoom({httpd: false});
        this.room.robot.receiveMiddleware((context, next, done) => {
            if (context.response.message instanceof TextMessage) {
                this.response = context.response;
            }
            next();
        });
    },

    afterTest: function () {
        this.room.destroy();
        Session.instance.conversation.reset();
        SchedulerService.shutdown();
        sinon.restore();
    },
    /**
     * @param room {Room} - The mock room.
     * @param requestText {string} - The text sent
     */
    expectNoMatchReply: function (room, requestText) {
        expect(room.messages).to.eql([
            ["bot_user", "@hubot " + requestText],
            ["hubot", "@bot_user I'm sorry, I don't know how to help with that.  Type `help` for options."]
        ]);
    },
    responses: responses
};
