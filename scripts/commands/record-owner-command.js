'use strict';

const {TextCommand, CommandDescriptor, ParameterDescriptor, VinylDnsService} = require("../lib");

/**
 * Command that handles the "who owns" action
 */
class RecordOwnerCommand extends TextCommand {
    /**
     * @param parent {Command}
     */
    constructor(parent) {
        super(parent);
        this._pattern = /^(?:owner|who owns)\s+`?(?:https?:\/\/)?([a-z0-9-_.]+)`?(?:\s+([a-z]))?/i;
        this._vinylDnsService = new VinylDnsService();
    }

    /**
     * @inheritDoc
     */
    get descriptor() {
        return new CommandDescriptor()
            .withName("owner")
            .withAlias("who owns")
            .withUsage("owner <fqdn> [recordType]")
            .addParameter(new ParameterDescriptor().withName("fqdn")
                                                   .asRequired()
                                                   .withDescription("The fully qualified domain name (e.g., my.example.com)"))
            .addParameter(new ParameterDescriptor().withName("recordType")
                                                   .withDefaultValue("any")
                                                   .withDescription("The type of the record to check (A,CNAME,TXT,etc)"))
            .withDescription("Finds the owner for the specific record given by the FQDN");
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
        let params = this._pattern.exec(interaction.requestText);
        let fqdn = params[1];
        let recordType;
        if (params.length > 2) {
            recordType = params[2];
        }
        let ownerLookup = await this._vinylDnsService.findOwnerByFqdn(fqdn, recordType);

        // Handle errors
        if (ownerLookup.errors.length > 0) {
            interaction.reply(`Sorry, ` + ownerLookup.errors[0].toLowerCase());
            return;
        }

        // Handle shared zone
        if (ownerLookup.isSharedZone) {
            interaction.reply(`\`${fqdn}\` is a shared zone.  There is no owner information to provide.`);
            return;
        }

        if (!ownerLookup.hasOwner) {
            interaction.reply(`The record \`${fqdn}\` is currently *Unowned*.`);
            return;
        }

        // Handle valid record
        interaction.reply(`Here is the owner information for \`${fqdn}\`:\n\n>*Group*\n>    👥 ${ownerLookup.ownerGroup.name}\n>*Email*\n>    📫 ${ownerLookup.ownerGroup.email}`);
    }
}

module.exports = RecordOwnerCommand;
