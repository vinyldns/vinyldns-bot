'use strict';

const {describe, it} = require('mocha');
const {expect} = require('chai');
const {ReactionCommand} = require("../scripts/lib");

describe('Reaction Command', () => {
    it("should not allow direct instantiation", () => {
        expect(() => new ReactionCommand()).to.throw(TypeError, "Abstract class \"ReactionCommand\" cannot be instantiated directly.");
    });
});
