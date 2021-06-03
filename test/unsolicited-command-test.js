'use strict';

const {describe, it} = require('mocha');
const {expect} = require('chai');
const {UnsolicitedCommand} = require("../scripts/lib");

describe('Unsolicited Command', () => {
    it("should not allow direct instantiation", () => {
        expect(() => new UnsolicitedCommand()).to.throw(TypeError, "Abstract class \"UnsolicitedCommand\" cannot be instantiated directly.");
    });
});
