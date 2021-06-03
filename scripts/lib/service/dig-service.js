'use strict';

const dig = require('node-dig-dns');
const {dig_config} = require('../../config');
const logger = require("../logger").forType("DigService");

class DigService {
    /**
     * @returns {function(string[],object): Promise<string>}
     * @private
     */
    get _digCommand() {
        return dig;
    }

    /**
     * Performs a DNS lookup against a specific resolver.
     *
     * @param name {string} - The name to lookup.
     * @param type {string} - The record type to return.
     * @param {boolean} [rawResponse=true] - The raw response
     * @returns {Promise<Object>|Promise<string>}
     */
    performLookup(name, type, rawResponse = true) {
        logger.debug("Performing 'dig @" + dig_config.dns_resolver + " " + name + " " + type + "'");
        return this._digCommand(['@' + dig_config.dns_resolver, name, type], {raw: rawResponse, dig: dig_config.dig_command});
    }
}

module.exports = DigService;
