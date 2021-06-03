'use strict';

class FaqItem {

    constructor() {
        this._responseLines = [];
    }

    /**
     * @returns {string[]}
     */
    get responseLines() {
        return this._responseLines;
    }

    /**
     * @returns {string}
     */
    get question() {
        return this._question;
    }

    /**
     * @returns {string[]}
     */
    get extraTerms() {
        return this._extraTerms;
    }

    /**
     * Sets the question for this FaqItem
     * @param question {string} - The question
     * @returns {FaqItem}
     */
    withQuestion(question) {
        this._question = question;
        return this;
    }

    /**
     * Adds a response to this FaqItem
     * @param responseLines {string[]} - The response lines.
     * @returns {FaqItem}
     */
    withResponseLines(responseLines) {
        this._responseLines = responseLines;
        return this;
    }

    /**
     * Adds extra search terms to this FaqItem.
     * @param extraTerms {string[]}
     */
    withExtraTerms(extraTerms) {
        this._extraTerms = extraTerms;
        return this;
    }
}

module.exports = FaqItem;