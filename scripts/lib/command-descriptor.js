'use strict';
const util = require("./util");
const {bot_config} = require("../config");

/**
 * Describes a command
 *
 * @see Command
 */
class CommandDescriptor {

    constructor() {
        this._name = "command";
        this._usage = "command";
        this._description = "command";
        this._parameters = [];
        this._private = false;

    }

    /**
     * @returns {string}
     */
    get alias() {
        return this._alias;
    }

    /**
     * @param {string} value
     */
    set alias(value) {
        this._alias = value;
    }

    /**
     * @param value {string}
     * @return {CommandDescriptor}
     */
    withAlias(value) {
        this.alias = value;
        return this;
    }

    /**
     * @returns {boolean}
     */
    get private() {
        return this._private;
    }

    /**
     * @param value {boolean}
     */
    set private(value) {
        this._private = value;
    }

    /**
     * @return {string}
     */
    get name() {
        return this._name;
    }

    /**
     * @param value {string}
     */
    set name(value) {
        this._name = value;
    }

    /**
     * @param value {string}
     * @return {CommandDescriptor}
     */
    withName(value) {
        this.name = value;
        return this;
    }

    /**
     * @return {string}
     */
    get usage() {
        return this._usage;
    }

    /**
     * @param value {string}
     */
    set usage(value) {
        this._usage = value;
    }

    /**
     * @param value {string}
     * @return {CommandDescriptor}
     */
    withUsage(value) {
        this.usage = value;
        return this;
    }

    /**
     * @return {string}
     */
    get description() {
        return this._description;
    }

    /**
     * @param value {string}
     */
    set description(value) {
        this._description = value;
    }

    /**
     * @param value {string}
     * @return {CommandDescriptor}
     */
    withDescription(value) {
        this.description = value;
        return this;
    }

    /**
     * @return {ParameterDescriptor[]}
     */
    get parameters() {
        return this._parameters;
    }

    /**
     * @param value {ParameterDescriptor[]}
     */
    set parameters(value) {
        this._parameters = value;
    }

    /**
     * @param value {ParameterDescriptor[]}
     * @return {CommandDescriptor}
     */
    withParameters(value) {
        this.parameters = value;
        return this;
    }

    /**
     * @param value {ParameterDescriptor}
     * @return {CommandDescriptor}
     */
    addParameter(value) {
        this.parameters.push(value);
        return this;
    }

    /**
     * Generates a help string from this descriptor.
     *
     * @return {string}
     */
    toHelpString() {
        let aliasInfo = "";
        if (util.isNotNullOrEmpty(this.alias)) {
            aliasInfo = " (alias: `" + this.alias + "`)";
        }
        return (`💻 \`${this.name}\`${aliasInfo} - ${this.description}\n` +
                "```USAGE:\n" +
                `@${bot_config.bot_name} ${this.usage}\n` +
                (this.parameters.length === 0 ? "    *This command has no parameters*" : this.parameters.map(x => "  " + x.toHelpString()).join("\n")) +
                "```");
    }
}

/**
 * Describes a command parameter.
 *
 * @see CommandDescriptor
 */
class ParameterDescriptor {
    constructor() {
        this._name = "command";
        this._isRequired = false;
        this._description = "command";
        this._defaultValue = "";
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    withName(value) {
        this.name = value;
        return this;
    }

    get isRequired() {
        return this._isRequired;
    }

    asRequired() {
        this.isRequired = true;
        return this;
    }

    get defaultValue() {
        return this._defaultValue;
    }

    set defaultValue(value) {
        this._defaultValue = value;
    }

    withDefaultValue(value) {
        this.defaultValue = value;
        return this;
    }

    set isRequired(value) {
        this._isRequired = value;
    }

    get description() {
        return this._description;
    }

    withDescription(value) {
        this.description = value;
        return this;
    }

    set description(value) {
        this._description = value;
    }

    toHelpString() {
        return this.name.padEnd(10) + " - " + (!this.isRequired ? "(Optional) " : "") + this.description;
    }
}

module.exports = {CommandDescriptor, ParameterDescriptor};
