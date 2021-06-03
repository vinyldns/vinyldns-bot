'use strict';

const util = require("../lib/util");
const TextCommand = require("../lib/text-command");
const FaqRepository = require("../lib/faq-repository");
const FaqSearchService = require("../lib/service/faq-search-service");
const FaqResourceCommand = require("./faq-list-command");

/**
 * Searches through FAQs based on keyword(s)
 */
class FaqSearchCommand extends TextCommand {
    /**
     * @param parent {Command}
     */
    constructor(parent) {
        super(parent);
        this._searchService = new FaqSearchService(new FaqRepository().allFaqs);
    }

    /**
     * @inheritDoc
     */
    get isRootCommand() {
        return false;
    }

    /**
     *
     * @inheritDoc
     */
    canExecute(interaction) {
        return super.canExecute(interaction) && /^\s*search(?:\s+(.*))?/i.test(interaction.requestText);
    }

    /**
     * @inheritDoc
     */
    async execute(interaction) {
        if (util.isNullOrEmpty(interaction.requestText)) {
            return;
        }
        let searchText = interaction.requestText.replace(/^\s*search\s*/, "");
        if (util.isNullOrEmpty(searchText)) {
            return;
        }

        // Look through the FAQs and find questions that have the most words in common with the searchWords
        let foundMatches = this._searchService.performSearch(searchText);

        if (foundMatches.length > 0) {
            await new FaqResourceCommand(this, null, foundMatches).withResponsePreface("The following questions matched:\n").execute(interaction);
            return;
        }

        interaction.reply("I'm sorry, I don't know how to help with that.  Type `help` for options.");
    }
}


module.exports = FaqSearchCommand;
