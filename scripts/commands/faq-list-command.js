'use strict';

const {bot_config} = require("../config");
const util = require("../lib/util");
const TextCommand = require("../lib/text-command");

/**
 * Displays a list of FAQs from which the user can select.
 */
class FaqListCommand extends TextCommand {
    /**
     * @param parent {Command}
     * @param pattern {RegExp}
     * @param faqs {FaqItem[]}
     */
    constructor(parent, pattern, faqs) {
        super(parent);
        this._pattern = pattern;
        this._faqs = faqs;
    }

    /**
     * @inheritDoc
     */
    get isRootCommand() {
        return false;
    }

    /**
     * @inheritDoc
     */
    canExecute(interaction) {
        return super.canExecute(interaction) && this._pattern.test(interaction.requestText);
    }

    /**
     * @return {FaqItem[]}
     */
    get faqs() {
        return this._faqs;
    }

    /**
     * The text to be placed before this commands response.
     * @param text {string}
     */
    set responsePreface(text) {
        this._responsePreface = text;
    }

    /**
     * The text to be placed before this commands response.
     * @returns {string}
     */
    get responsePreface() {
        if (util.isNullOrEmpty(this._responsePreface)) {
            return "";
        }
        return this._responsePreface;
    }

    /**
     * @param text {string}
     */
    withResponsePreface(text) {
        this.responsePreface = text;
        return this;
    }

    /**
     * @inheritDoc
     */
    async execute(interaction) {
        interaction.reply(this.responsePreface +
                          this.faqs.map((x, i) => `   \`${i + 1}\` ${x.question}`).join("\n") +
                          "\n\n" + (this.faqs.length > 1 ? "Please reply with a corresponding number. " : "") + "Use `back`, `home` or `help` to go back; `cancel` to end.");

        interaction.openDialog().nextCommands = [new FaqResponseCommand(this, this.faqs)];

        if (this.faqs.length === 1) {
            let newInteraction = interaction.clone();
            newInteraction.requestText = "1";
            await new FaqResponseCommand(this, this.faqs).execute(newInteraction);
        } else {
            // See if we have a pre-chosen number
            if (/^(?:[^\s]+)\s([0-9]+)/.test(interaction.requestText)) {
                interaction.requestText = interaction.requestText.replace(/^(?:[^\s]+)\s([0-9]+)/, "$1");
                interaction.reply(interaction.requestText);
                interaction.reprocess();
            }
        }
    }
}

class FaqResponseCommand extends TextCommand {
    /**
     * @param {Command} parent
     * @param {FaqItem[]} faqs - Faqs
     */
    constructor(parent, faqs) {
        super(parent);
        this._faqs = faqs;
        this._pattern = /([0-9]+)/;
    }

    /**
     * @inheritDoc
     */
    get isRootCommand() {
        return false;
    }

    /**
     * @inheritDoc
     */
    canExecute(interaction) {
        return super.canExecute(interaction) && this._pattern.test(interaction.requestText);
    }

    /**
     * @inheritDoc
     */
    async execute(interaction) {
        let choiceTxt = this._pattern.exec(interaction.requestText)[1];
        let choice = parseInt(choiceTxt);
        if (choice > this._faqs.length) {
            interaction.reply(bot_config.default_response(interaction));
        } else {
            if (this._faqs[choice - 1].responseLines.length > 0) {
                interaction.reply(this._faqs[choice - 1].responseLines.join("\n\n"))
            }
        }
    }
}

module.exports = FaqListCommand;
