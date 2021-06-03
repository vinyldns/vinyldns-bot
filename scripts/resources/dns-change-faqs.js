'use strict';

const {bot_config} = require("../config");
const FaqItem = require("../lib/faq-item");

const faqItems = [
    new FaqItem()
        .withQuestion("How can I create a record with the same name as my zone?")
        .withExtraTerms(["CNAME", "apex", "@", "domain"])
        .withResponseLines([
            "To create a record with the same name as your zone, you have to use the special `@` character for the record name when you create your record set.",
            "> NOTE: You cannot create `CNAME` records with `@` as those are not supported. All other record types should be fine using the `@` symbol",
            "> This is a restriction of DNS as a standard and not VinylDNS.  For more information see: <Why can't I have a CNAME at the zone apex|https://www.isc.org/blogs/cname-at-the-apex-of-a-zone/>"
        ]),

    new FaqItem()
        .withQuestion("How long does it take to apply DNS changes in VinylDNS?")
        .withResponseLines([
            "Changes submitted to VinylDNS are processed immediately, typically taking a few seconds to complete processing.",
            "If your DNS change is in `Manual Review` it will take longer.",
            "If your DNS change is `scheduled` it will be held until the requested day and time, then approved and processed or rejected."
        ]),

    new FaqItem()
        .withQuestion("How can I check if my change went through?")
        .withResponseLines([
            "Once a DNS request has been processed in VinylDNS, refreshing the record set changes history section of the portal or alternatively sending a GET request for the record set in VinylDNS will provide feedback on whether the change went through.",
            "There are times where users may want to confirm whether the change has been applied to the DNS backend. We suggest using the `dig` command to query for a record change on the DNS servers:",
            "```@" + bot_config.bot_name + " dig foo.bar <record type>```",
            "The `<record type>` should be the type of the record you're checking.  This defaults to `A`."
        ]),

    new FaqItem()
        .withQuestion("I submitted my DNS Change, but it is telling me zone xxx does not exist?")
        .withExtraTerms(["domain"])
        .withResponseLines([
            "When submitting a DNS Change, VinylDNS performs Zone Discovery that checks to make sure that all of the DNS zones exist and are registered in VinylDNS. If any zones do not exist, you will see a failure message and can submit the DNS Change for manual review if no other hard failures exist. These will happen most frequently for `AAAA` record types (IPv6 Addresses).",
            "The VinylDNS administrators will create the zones needed and approve your DNS Change for processing. If they are unable to add the needed zones to VinylDNS they will reject the DNS Change and provide a comment indicating why."
        ]),

    new FaqItem()
        .withQuestion("Why does my DNS Change say Pending Review?")
        .withResponseLines([
            "Your DNS change is in good order, but has tripped one or more flags that require manual review. This typically happens for `Zone Discovery` or `Manual Review` warnings.",
            "> NOTE: You can cancel a DNS Change at anytime while it is in a Pending Review state."
        ]),

    new FaqItem()
        .withQuestion("How do I make an SRV Record Change?")
        .withResponseLines([
            "SRV records are not yet supported via the DNS Change interface."
        ]),

    new FaqItem()
        .withQuestion("Why was my DNS Change rejected?")
        .withResponseLines([
            "DNS Changes in a Scheduled or Pending Review state may be cancelled by a reviewer. The reviewer may optionally provide additional details during the review as to why the DNS Change was rejected. While DNS Changes may be rejected for many reasons."
        ]),

    new FaqItem()
        .withQuestion("What are dotted hosts and why can't I use them?")
        .withResponseLines([
            "Record names within your zone that contains dots (`.`) are called `dotted hosts` (at least in VinylDNS parlance).",
            "For example, `foo.bar.example.com` is _invalid_, and considered a `dotted host`, if it lives inside of the `example.com` DNS zone. For this to be a valid record, this label would need to be a record named `foo` inside of the `bar.example.com` zone.",
            "Due to our design, VinylDNS does not allow dotted hosts. When requesting DNS record names like `x.y.zone`, please consider using `x-y.zone` instead."
        ]),

    new FaqItem()
        .withQuestion("Zone Discovery Failed: zone for \"<input>\" does not exist in VinylDNS")
        .withExtraTerms(["domain"])
        .withResponseLines([
            "The zone for this record cannot be found in VinylDNS. The record requires a zone to be created to our backend DNS servers before this change can be completed. The DNS Change " +
            "will enter a “Pending Review” state until it can be processed. Turn around for completion is 24 hours."
        ]),

    new FaqItem()
        .withQuestion("Record set with name <input> requires manual review.")
        .withResponseLines([
            "The DNS record you are trying to create updates a DNS zone that requires manual review."
        ]),

    new FaqItem()
        .withQuestion("Zone \"XYX\" in a shared zone, so owner group ID must be specified for record \"ABC\".")
        .withExtraTerms(["domain"])
        .withResponseLines([
            "This means you attempted to submit your changes without including a Record Owner Group. All changes in shared zones will be associated with a group that you (or your team) " +
            "should create. Only members of that group will be able to update/delete the records you create. You should discuss with your team or manager if there is a VinylDNS group that " +
            "you should be a member of. Also, you can view “All Groups” and see if there is a group that you should belong to. To create a new group follow the steps <https://www.vinyldns.io/portal/create-a-group|here>.",
        ]),

    new FaqItem()
        .withQuestion("User \"<user>\" is not authorized.")
        .withResponseLines([
            "You do not have the appropriate access to make the DNS Change. This can happen for a number of reasons:",
            "You are attempting to manage a record in a private zone that you do not have access to. Not all zones in VinylDNS are shared, i.e. intended for anyone to work with. " +
            "A number of zones are “private” that have enhanced security. Search for the zone in `Zones --> All Zones` and see if it is Private or Shared. If it is marked Private, reach " +
            "out to the group distribution for the zone to request access. They can also make the change on your behalf, and you can remove it from your DNS Change.",
            "You are attempting to manage a record in a shared zone that is owned by someone else. When you create (or update) a record in a shared zone, the record owner group " +
            "you use to make the change becomes the owner of the DNS record. In this instance, it is possible that some other party created or updated the record using a group " +
            "that you are not a member of. Search for the zone in `Zones --> All Zones` and see if it is Private or Shared. If it is Shared, then contact `@vinyl`."
        ]),

    new FaqItem()
        .withQuestion("Record Name \"<record name>\" is configured as a High Value Domain, so it cannot be modified.")
        .withResponseLines([
            "You are attempting to create a record with a name or IP address that is not allowed in VinylDNS. You can contact the `@vinyl` with the record information and they will tell you if/how you can proceed."
        ]),

    new FaqItem()
        .withQuestion("Record \"<record name>\" Already Exists: cannot add an existing record.")
        .withExtraTerms(["DeleteRecordSet", "update"])
        .withResponseLines([
            "You are attempting to add a record that already exists.  VinylDNS currently does not support directly updating records through batch changes.",
            "You *must* add a DeleteRecordSet change for every record you wish to update.  These will be issued together and will effectively update the record.",
            "For example, to change `example.foo.net` from `10.0.0.1` to `192.168.0.1`, you'd issue two changes:",
            "> `DeleteRecordSet` `A` `example.foo.net` `7200` `10.0.0.1`",
            "> `Add` `A` `example.foo.net` `7200` `192.168.0.1`"
        ]),
];

module.exports = {
    faqItems: faqItems
};
