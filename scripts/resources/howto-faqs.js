'use strict';

const FaqItem = require("../lib/faq-item");

const faqItems = [
    new FaqItem()
        .withQuestion("How do I connect to my zone?")
        .withExtraTerms(["domain"])
        .withResponseLines([
            "Step by step instructions for connecting to your zone can be found in our online documentation:",
            "Link: <https://www.vinyldns.io/portal/connect-to-zone|Connect to Your Zone>"
        ]),

    new FaqItem()
        .withQuestion("How do I manage DNS records?")
        .withResponseLines([
            "Detailed instructions for managing DNS records can be found in our online documentation:",
            "Link: <https://www.vinyldns.io/portal/manage-records|Manage Records>"
        ]),

    new FaqItem()
        .withQuestion("How do I manage access to DNS zones and records?")
        .withExtraTerms(["zone", "domain"])
        .withResponseLines([
            "Detailed instructions for managing access to DNS zones and records can be found in our online documentation:",
            "Link: <https://www.vinyldns.io/portal/manage-access|Manage Access>"
        ]),

    new FaqItem()
        .withQuestion("How do I search zones?")
        .withExtraTerms(["zone", "domain"])
        .withResponseLines([
            "Detailed instructions for searching zones can be found in our online documentation:",
            "Link: <https://www.vinyldns.io/portal/search-zones|Search Zones>"
        ]),

    new FaqItem()
        .withQuestion("How do I create a group?")
        .withResponseLines([
            "Step by step instructions for creating a group can be found in our online documentation:",
            "Link: <https://www.vinyldns.io/portal/create-a-group|Create a Group>"
        ]),

    new FaqItem()
        .withQuestion("How do I manage group membership?")
        .withResponseLines([
            "Step by step instructions for managing group membership can be found in our online documentation:",
            "Link: <https://www.vinyldns.io/portal/manage-membership|Manage Membership>"
        ]),

    new FaqItem()
        .withQuestion("What is Manual Review and Scheduling?")
        .withResponseLines([
            "Detailed information about manual review and scheduling can be found in our online documentation:",
            "Link: <https://www.vinyldns.io/portal/manual-review-scheduling|DNS Changes: Manual Review & Scheduling>"
        ]),

    new FaqItem()
        .withQuestion("How can I create my own Slack support bot?")
        .withResponseLines([
            "We make the code for the VinylDNS Bot available on Github!",
            "Link: <https://github.com/VinylDNS/vinyldns-bot|vinyldns-bot Github Repo>"])

];

module.exports = {
    faqItems: faqItems
};
