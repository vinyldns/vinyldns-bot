'use strict';

const {TextCommand, CommandDescriptor, ParameterDescriptor, DigService, util} = require("../lib");
const {dig_config} = require('../config');
const logger = require("../lib/logger").forType("LookupCommand");
const matchExp = new RegExp("^(?:current record|lookup)\\s`?(?:https?://)?([a-z0-9-_.]+)`?(?:\\s`?(" + dig_config.valid_records.sort((a, b) => b.length - a.length).join("|") + ")`?)?", "i");

/**
 * Command that handles the "lookup" action
 */
class LookupCommand extends TextCommand {
    /**
     * @param parent {Command}
     */
    constructor(parent) {
        super(parent);
    }

    /**
     * @inheritDoc
     */
    get descriptor() {
        return new CommandDescriptor()
            .withName("lookup")
            .withAlias("current record")
            .withUsage("lookup <domain_name> [record_type]")
            .addParameter(new ParameterDescriptor().withName("domain_name").withDescription("The domain you want to query").asRequired())
            .addParameter(new ParameterDescriptor().withName("record_type").withDescription("The type of the record to lookup").withDefaultValue("A"))
            .withDescription("Performs a DNS query to get the current value of the record *as reported by the name server*.  This is good for checking whether your changes have been published.");
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

        await new DigService().performLookup(domain, type, false)
                              .then((result) => {
                                  let status = result.header.map(x => x[0]).find(x => x.includes("status"))
                                  let answers = result.answer;

                                  if (util.isNullOrEmpty(answers)) {
                                      interaction.reply("No results found.  The server returned `" + status + "`")
                                  } else {
                                      let result = "Returning results directly from the name server (not from VinylDNS cache):\n";
                                      for (let i = 0; i < answers.length; i++) {
                                          result += "> 📋 *Record Found* 📋\n";
                                          result += "> Record: `" + answers[0].domain + "`\n";
                                          result += "> Type: `" + answers[0].type + "`\n";
                                          result += "> TTL: `" + answers[0].ttl + "`\n";
                                          result += "> Value: `" + answers[0].value + "`\n";
                                          result += "\n\n";
                                      }
                                      interaction.reply(result);
                                  }
                              })
                              .catch((err) => {
                                  logger.error(`Error during lookup of domain ${domain}`, err);
                                  interaction.reply(`\`\`\`${err}\`\`\``);
                              });
    }
}

module.exports = LookupCommand;
