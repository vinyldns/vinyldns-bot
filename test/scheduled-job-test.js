'use strict';

const {describe, it} = require('mocha');
const {expect} = require('chai');

const ScheduledJob = require("../scripts/jobs/scheduled-job");

describe('Base Scheduled Job', () => {
    it("should not allow direct instantiation", () => {
        expect(() => new ScheduledJob("name")).to.throw(TypeError, "Abstract class \"ScheduledJob\" cannot be instantiated directly.");
    });
});