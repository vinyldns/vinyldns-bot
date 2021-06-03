'use strict';

const {TextCommand, CommandDescriptor, ParameterDescriptor, util, FaqRepository} = require("../lib");
const {bot_config} = require("../config");
const FaqListCommand = require("./faq-list-command");
const FaqSearchCommand = require("./faq-search-command");
const CommandUsageCommand = require("./command-usage-command");

/**
 * Provides interactive help dialog.
 */
class HelpCommand extends TextCommand {
    /**
     * @param parent {Command} the parent command, if applicable
     */
    constructor(parent) {
        super(parent);
        this._faqRepository = new FaqRepository();
        this._pattern = /^(?:help|home|back)( .*)?/i;
    }

    /**
     * @inheritDoc
     */
    get descriptor() {
        return new CommandDescriptor()
            .withName("help")
            .withUsage("help [command|change|access|delegation|zone]")
            .addParameter(new ParameterDescriptor().withName("command").withDescription("Help for " + bot_config.bot_name + " commands"))
            .addParameter(new ParameterDescriptor().withName("change").withDescription("Help for DNS changes"))
            .addParameter(new ParameterDescriptor().withName("access").withDescription("Help access and credentials"))
            .addParameter(new ParameterDescriptor().withName("delegation").withDescription("Help for DNS delegations"))
            .addParameter(new ParameterDescriptor().withName("zone").withDescription("Help for zone connection and errors"))
            .withDescription("Provides interactive help");
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
        let commandParameters = this._pattern.exec(interaction.requestText);
        const help_commands = {
            "search": () => new FaqSearchCommand(this),
            "command": () => new CommandUsageCommand(this, /^\s*(command|1)/),
            "change": () => new FaqListCommand(this, /^\s*(change|2)/, this._faqRepository.retrieveFaqs("dns-change")).withResponsePreface("Here are questions corresponding to changes:\n"),
            "access": () => new FaqListCommand(this, /^\s*(access|3)/, this._faqRepository.retrieveFaqs("access")).withResponsePreface("Here are questions corresponding to access and credentials:\n"),
            "delegation": () => new FaqListCommand(this, /^\s*(delegation|4)/, this._faqRepository.retrieveFaqs("delegation")).withResponsePreface("Here are questions corresponding to DNS delegation:\n"),
            "zone": () => new FaqListCommand(this, /^\s*(zone|5)/, this._faqRepository.retrieveFaqs("zone-connection")).withResponsePreface("Here are questions corresponding to zones:\n"),
        };

        // This this was executed with no parent, and if the sub command was already passed, go directly to it
        // We won't have a parent if this is executed directly from the bot, but we will if another command is sending us back here.
        if (util.isNullOrEmpty(this.parent) && commandParameters.length > 1 && util.isNotNullOrEmpty(commandParameters[1])) {
            let subCommand = commandParameters[1].trim();
            let subInteraction = interaction.clone();
            subInteraction.requestText = subCommand;
            for (let key in help_commands) {
                // Allow for partial matches ("help commands" = "help command")
                const commandInstance = help_commands[key]();
                if (commandInstance.canExecute(subInteraction)) {
                    await commandInstance.execute(subInteraction);
                    return;
                }
            }
        }

        // If we have a catch all help command, show the options.
        interaction.reply('What can I help you with?\n' +
                          "  `1` Available " + bot_config.bot_name + " `commands`\n" +
                          "  `2` DNS `changes`\n" +
                          "  `3` `Access` and credentials\n" +
                          "  `4` DNS `delegations` (such as AWS Route 53)\n" +
                          "  `5` `Zone` connections/errors\n" +
                          "\nReply with a `number` or one of the `highlighted` words. To search type `search <search terms>`.");

        let dialog = interaction.openDialog();
        dialog.nextCommands = [];
        for (let faqCommandsKey in help_commands) {
            dialog.nextCommands.push(help_commands[faqCommandsKey]());
        }
    }
}

module.exports = HelpCommand;
