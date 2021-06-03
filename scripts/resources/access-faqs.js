'use strict';

const FaqItem = require("../lib/faq-item");

const faqItems = [
    new FaqItem()
        .withQuestion("How do I get API credentials?")
        .withResponseLines([
            "After logging in to the portal, click your username at the top right and select `Download API Credentials`."])

];

module.exports = {
    faqItems: faqItems
};
