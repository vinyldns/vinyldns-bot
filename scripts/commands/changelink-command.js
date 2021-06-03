'use strict';

const {TextCommand} = require("../lib");
const matchExp = new RegExp(/(?<!\/)[\w]{8}[-][\w]{4}[-][\w]{4}[-][\w]{4}[-][\w]{12}/);
const url = "[base-url]/dnschanges/";

/**
 * Returns DNS Change Link when GUID specified.
 */
class ChangeLinkCommand extends TextCommand {
    /**
     * @param parent {Command} the parent command, if applicable
     */
    constructor(parent) {
        super(parent);
    }

    /**
     * @inheritDoc
     */
    get descriptor() {
        return null;
    }

    /**
     * @inheritDoc
     */
    canExecute(interaction) {
        return super.canExecute(interaction) && matchExp.test(interaction.requestText);
    }

    /**
     * @inheritDoc
     */
    async execute(interaction) {
        let params = matchExp.exec(interaction.requestText);
        interaction.reply("Here's a link to your DNS Change: " + url + params)
    }
}

module.exports = ChangeLinkCommand;
