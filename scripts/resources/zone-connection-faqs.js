'use strict';

const FaqItem = require("../lib/faq-item");

const faqItems = [
    new FaqItem()
        .withQuestion("Can I create a zone in VinylDNS?")
        .withExtraTerms(["domain"])
        .withResponseLines([
            "To get started with VinylDNS, you must have an existing DNS zone. VinylDNS currently does not create zones, rather it connects to existing zones."
        ]),

    new FaqItem()
        .withQuestion("Do I need my own `TSIG` keys in VinylDNS?")
        .withResponseLines([
            "As VinylDNS uses a set of default keys when zone connection information is not provided, most users will not require their own key to manage their zones. See the <https://www.vinyldns.io/portal/connections|Understanding Connections section> of the VinylDNS portal documentation for information whether a `TSIG` is needed for corresponding connection types.",
        ]),

    new FaqItem()
        .withQuestion("When I try to connect to my zone, I am seeing `REFUSED`")
        .withResponseLines([
            "When VinylDNS connects to a zone, it first validates that the zone is suitable for use in VinylDNS. To do so, it tests that the connections work, and that the zone data is valid.",
            "`REFUSED` indicates that VinylDNS could not do a zone transfer to load the DNS records for examination. A few reasons for this are:",
            "The Transfer Connection you entered is invalid. Please verify that the `TSIG` information you entered works. You can attempt to do a `dig` and request a zone transfer from the command line.",
            "You did not setup a Transfer Connection, but the VinylDNS default keys do not have transfer access to your zone."
        ]),

    new FaqItem()
        .withQuestion("When I try to connect to my zone, I am seeing `NOTAUTH`")
        .withResponseLines([
            "`NOTAUTH` indicates that the primary connection that VinylDNS uses to validate the zone is not working. The reasons are:",
            "The Connection you entered is invalid. Please verify that the TSIG information you entered works.",
            "You did not setup a Connection, but the VinylDNS default keys do not have update access to your zone."
        ]),

    new FaqItem()
        .withQuestion("When I try to connect to my zone, I am seeing `Invalid Name Server` errors")
        .withResponseLines([
            "One of the validations VinylDNS performs is to make sure the name servers that are in use in the zone are in a list of approved name servers. If your zone is hosted on name servers that are not in this list, you will not be able to use VinylDNS to manage your zone."
        ]),

    new FaqItem()
        .withQuestion("How do I know my zone ID?")
        .withExtraTerms(["domain"])
        .withResponseLines([
            "When viewing your zone in the portal, the zone ID is listed in the Manage Zone tab of your zone. This ID is also present in the URL (if you are on that page it’s the ID after /zones/).",
            "The ID can also be pulled via VinylDNS tools that interact with the API directly. For example, the `zones` command of the `vinyldns-cli`",
            "```" +
            "$ VinylDNS_Support-cli zones\n" +
            "+-----------------------------------------+--------------------------------------+\n" +
            "|                  NAME                   |                  ID                  |\n" +
            "+-----------------------------------------+--------------------------------------+\n" +
            "| foo.example.net.                        | xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |\n" +
            "+-----------------------------------------+--------------------------------------+\n" +
            "| bar.foo.example.net.                    | xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |\n" +
            "+-----------------------------------------+--------------------------------------+" +
            "```",
        ]),
];

module.exports = {
    faqItems: faqItems
};
