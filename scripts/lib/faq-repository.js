'use strict';
const util = require("../lib/util")

class FaqRepository {
    constructor() {
        FaqRepository.initialize();
    }

    /**
     * @returns {Map<string, FaqItem[]>}
     */
    get faqMap() {
        return FaqRepository._faqMap;
    }

    /**
     * @returns {FaqItem[]}
     */
    get allFaqs() {
        return util.flatMap(x => x[1], Array.from(this.faqMap.entries()));
    }

    /**
     * Retrieves the FAQs for the given faqName.
     * @param faqName {string}
     * @returns {FaqItem[]}
     */
    retrieveFaqs(faqName) {
        return this.faqMap.get(faqName);
    }

    static initialize() {
        if (util.isNullOrEmpty(FaqRepository._faqMap)) {
            const normalizedPath = require("path").join(__dirname, "../resources");
            FaqRepository._faqMap = new Map();
            require("fs").readdirSync(normalizedPath)
                         .filter(x => x.endsWith("-faqs.js"))
                         .forEach((file) => FaqRepository._faqMap.set(file.replace(/-faqs\.js/, ""), (require("../resources/" + file)).faqItems));
        }
    }
}

module.exports = FaqRepository;