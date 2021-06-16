'use strict';

const {describe, it} = require('mocha');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));

const {DigService} = require("../scripts/lib");
const {sinon} = require("./shared");

describe('Dig Service', () => {
    it("should perform a dig with specific parameters", async () => {
        sinon.stub(DigService.prototype, "_digCommand").get(() => (a, b) => new Promise(resolve => resolve([a, b])));
        await expect(new DigService().performLookup("domain.name", "TYPE")).to.eventually.eql([
            [
                "@my.resolver.net",
                "domain.name",
                "TYPE"
            ],
            {
                "dig": "dig",
                "raw": true
            }
        ]);
    });
});
