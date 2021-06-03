'use strict';

const {describe, it, beforeEach, afterEach} = require('mocha');
const {expect} = require('chai');

const {beforeTest, afterTest, sinon, responses, expectNoMatchReply} = require("./shared");
const {Interaction, FaqSearchService, FaqItem, AuthorizationService} = require('../scripts/lib');

describe('Help Command', () => {
    beforeEach(() => beforeTest.apply(this));
    afterEach(() => afterTest.apply(this));

    it("should respond to request in a thread", () => {
        sinon.stub(Interaction.prototype, 'threadIdentifier').get(() => "thread_id");
        return this.room.user.say("bot_user", "@hubot help")
                   .then(() => {
                       expect(this.response.message.thread_ts).to.eql("thread_id");
                   });
    });

    it("should respond with menu of options if no command chaining", () => {
        return this.room.user.say("bot_user", "@hubot help")
                   .then(() => {
                       expect(this.room.messages).to.eql([
                           ['bot_user', '@hubot help'],
                           ["hubot", "@bot_user " + responses.help.menu]
                       ]);
                   });
    });

    it("should return public command help if option 1 is chosen and is not DM", () => {
        // Assume full access
        sinon.stub(AuthorizationService.prototype, "hasAccess").returns("true");
        sinon.stub(Interaction.prototype, "isDirectMessage").returns("false");
        return this.room.user.say("bot_user", "@hubot help")
                   .then(() => {
                       return this.room.user.say("bot_user", "1")
                                  .then(() => {
                                      expect(this.room.messages).to.have.lengthOf(4);
                                      expect(this.room.messages[3][1]).to.eql("@bot_user " + responses.usage.public_commands());
                                  });
                   });
    });

    it("should return all command help if option 1 is chosen and is DM", () => {
        // Assume full access
        sinon.stub(AuthorizationService.prototype, "hasAccess").returns("true");
        sinon.stub(Interaction.prototype, "isDirectMessage").returns("true");
        return this.room.user.say("bot_user", "@hubot help")
                   .then(() => {
                       return this.room.user.say("bot_user", "1")
                                  .then(() => {
                                      expect(this.room.messages).to.have.lengthOf(4);
                                      expect(this.room.messages[3][1]).to.eql("@bot_user " + responses.usage.public_commands());
                                  });
                   });
    });

    it("should return dns change help if option 2 is chosen", () => {
        return this.room.user.say("bot_user", "@hubot help")
                   .then(() => {
                       return this.room.user.say("bot_user", "2")
                                  .then(() => {
                                      expect(this.room.messages).to.have.lengthOf(4);
                                      expect(this.room.messages[3][1]).to.eql("@bot_user " + responses.faq.changes);
                                  });
                   });
    });

    it("should return first faq when option 2, item 1 selected", () => {
        return this.room.user.say("bot_user", "@hubot help")
                   .then(() => {
                       return this.room.user.say("bot_user", "2")
                                  .then(() => {
                                      return this.room.user.say("bot_user", "1")
                                                 .then(() => {
                                                     expect(this.room.messages).to.have.lengthOf(6);
                                                     expect(this.room.messages[5][1]).to.eql("@bot_user " + responses.faq.items.dns_change_faqs[0].responseLines.join("\n\n"));
                                                 });
                                  });
                   });
    });

    it("should return access help if option 3 is chosen", () => {
        return this.room.user.say("bot_user", "@hubot help")
                   .then(() => {
                       return this.room.user.say("bot_user", "3")
                                  .then(() => {
                                      expect(this.room.messages).to.have.lengthOf(4);
                                      expect(this.room.messages[3][1]).to.eql("@bot_user " + responses.faq.access);
                                  });
                   });
    });

    it("should return first faq when option 3, item 1 selected", () => {
        return this.room.user.say("bot_user", "@hubot help")
                   .then(() => {
                       return this.room.user.say("bot_user", "3")
                                  .then(() => {
                                      return this.room.user.say("bot_user", "1")
                                                 .then(() => {
                                                     expect(this.room.messages).to.have.lengthOf(6);
                                                     expect(this.room.messages[5][1]).to.eql("@bot_user " + responses.faq.items.access_faqs[0].responseLines.join("\n\n"));
                                                 });
                                  });
                   });
    });

    it("should return DNS delegation help if option 4 is chosen", () => {
        return this.room.user.say("bot_user", "@hubot help")
                   .then(() => {
                       return this.room.user.say("bot_user", "4")
                                  .then(() => {
                                      expect(this.room.messages).to.have.lengthOf(4);
                                      expect(this.room.messages[3][1]).to.eql("@bot_user " + responses.faq.delegation);
                                  });
                   });
    });

    it("should return first faq when option 4, item 1 selected", () => {
        return this.room.user.say("bot_user", "@hubot help")
                   .then(() => {
                       return this.room.user.say("bot_user", "4")
                                  .then(() => {
                                      return this.room.user.say("bot_user", "1")
                                                 .then(() => {
                                                     expect(this.room.messages).to.have.lengthOf(6);
                                                     expect(this.room.messages[5][1]).to.eql("@bot_user " + responses.faq.items.delegation_faqs[0].responseLines.join("\n\n"));
                                                 });
                                  });
                   });
    });

    it("should return zone help if option 5 is chosen", () => {
        return this.room.user.say("bot_user", "@hubot help")
                   .then(() => {
                       return this.room.user.say("bot_user", "5")
                                  .then(() => {
                                      expect(this.room.messages).to.have.lengthOf(4);
                                      expect(this.room.messages[3][1]).to.eql("@bot_user " + responses.faq.zones);
                                  });
                   });
    });

    it("should return first faq when option 5, item 1 selected", () => {
        return this.room.user.say("bot_user", "@hubot help")
                   .then(() => {
                       return this.room.user.say("bot_user", "5")
                                  .then(() => {
                                      return this.room.user.say("bot_user", "1")
                                                 .then(() => {
                                                     expect(this.room.messages).to.have.lengthOf(6);
                                                     expect(this.room.messages[5][1]).to.eql("@bot_user " + responses.faq.items.zone_faqs[0].responseLines.join("\n\n"));
                                                 });
                                  });
                   });
    });

    it("should return \"Sorry, no matches\" and the help menu for a search that doesn't match", () => {
        sinon.stub(Interaction.prototype, 'clone').returnsThis(); // Need to preserve the mock adapter's messages so we can assert
        return this.room.user.say("bot_user", "@hubot help search __invalid__")
                   .then(() => {
                       expectNoMatchReply(this.room, "help search __invalid__");
                   });
    });

    it("should return all matches for a search that returns results", () => {
        sinon.stub(FaqSearchService.prototype, 'performSearch').returns([new FaqItem().withQuestion("This is a test question.")]);
        sinon.stub(Interaction.prototype, 'clone').returnsThis(); // Need to preserve the mock adapter's messages so we can assert
        return this.room.user.say("bot_user", "@hubot help search some text")
                   .then(() => {
                       expect(this.room.messages).to.eql([
                           ["bot_user", "@hubot help search some text"],
                           ["hubot", "@bot_user " + responses.search.prefix + "   `1` This is a test question." + responses.search.suffix]
                       ]);
                   });
    });

    it("should default to search if no command found", () => {
        sinon.stub(FaqSearchService.prototype, 'performSearch').returns([new FaqItem().withQuestion("This is a test question.")]);
        return this.room.user.say("bot_user", "@hubot bogus_command")
                   .then(() => {
                       expect(this.room.messages).to.have.lengthOf(2);
                       expect(this.room.messages).to.eql([
                           ["bot_user", "@hubot bogus_command"],
                           ["hubot", "@bot_user " + responses.search.prefix + "   `1` This is a test question." + responses.search.suffix]
                       ]);
                   });
    });
});

