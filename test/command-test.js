'use strict';

const {describe, it} = require('mocha');
const {expect} = require('chai');
const {Command} = require("../scripts/lib");

describe('Base Command', () => {
    it("should not allow direct instantiation", () => {
        expect(() => new Command()).to.throw(TypeError, "Abstract class \"Command\" cannot be instantiated directly.");
    });
});