'use strict';

const {TextCommand, CommandDescriptor, ParameterDescriptor, DigService, Logger, util} = require("../lib");
const {dig_config} = require('../config');
const logger = Logger.forType("DigCommand");
const matchExp = new RegExp("^dig\\s`?(?:https?://)?([a-z0-9-_.]+)`?(?:\\s`?(" + dig_config.valid_records.sort((a, b) => b.length - a.length).join("|") + ")`?)?", "i");

/**
 * Executes the dig commandline command.
 */
class DigCommand extends TextCommand {
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
        return new CommandDescriptor()
            .withName("dig")
            .withUsage("dig <domain_name> [record_type]")
            .addParameter(new ParameterDescriptor().withName("domain_name").withDescription("The domain you want to query").asRequired())
            .addParameter(new ParameterDescriptor().withName("record_type").withDescription("The type of the record to lookup").withDefaultValue("A"))
            .withDescription("Performs a DNS query to get the current value of the record *as reported by the name server*");
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
        let type = "A";
        let params = matchExp.exec(interaction.requestText);
        let domain = params[1];
        if (params.length >= 3 && util.isNotNullOrEmpty(params[2])) {
            type = params[2];
        }

        await new DigService().performLookup(domain, type)
                              .then((result) => {
                                  interaction.sendSnippet("dig_results.txt",
                                      result,
                                      `Here are the *latest* records for \`${domain}\`\n_(click :point_down: to expand)_`);

                              })
                              .catch((err) => {
                                  logger.error(`Error during lookup of domain ${domain}`, err);
                                  interaction.reply(`\`\`\`${err}\`\`\``);
                              });
    }
}

module.exports = DigCommand;
