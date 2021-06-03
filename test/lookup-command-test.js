'use strict';

const {describe, it, beforeEach, afterEach} = require('mocha');
const {expect} = require('chai');

const {beforeTest, afterTest, sinon} = require("./shared");
const {DigService} = require("../scripts/lib");

describe('Lookup Command', () => {
    beforeEach(() => {
        beforeTest.apply(this);
        sinon.stub(DigService.prototype, 'performLookup').callsFake((a, b) => new Promise(resolve => resolve({
            "header": [
                ["; <<>> DiG 9.16.0 <<>> @dns101.foo.net " + a + " " + b],
                ["; (2 servers found)"],
                [";; global options: +cmd"],
                [";; Got answer:"],
                [";; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 17951"],
                [";; flags: qr aa rd; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1"],
                [";; WARNING: recursion requested but not available"]
            ],
            "question": [
                [";" + a + ".", "IN", b]
            ],
            "answer": [{
                "domain": a,
                "type": b,
                "ttl": "7200",
                "class": "IN",
                "value": "96.115.224.66"
            }
            ],
            "time": 101,
            "server": "2001:558:fe23:8:69:252:250:103#53(2001:558:fe23:8:69:252:250:103)",
            "datetime": "Tue May 26 16:46:13 Eastern Daylight Time 2020",
            "size": 76
        })));
    });
    afterEach(() => afterTest.apply(this));

    it("should default to A record types", () => {
        return this.room.user
                   .say("bot_user", "@hubot lookup some.host.name")
                   .then(() => {
                       expect(this.room.messages).to.eql([
                           ["bot_user", "@hubot lookup some.host.name"],
                           ["hubot", "@bot_user Returning results directly from the name server (not from VinylDNS cache):\n" +
                                     "> 📋 *Record Found* 📋\n" +
                                     "> Record: `some.host.name`\n" +
                                     "> Type: `A`\n" +
                                     "> TTL: `7200`\n" +
                                     "> Value: `96.115.224.66`\n\n\n"]
                       ]);
                   })
    });

    it("should allow type to be specified", () => {
        return this.room.user
                   .say("bot_user", "@hubot lookup some.host.name CNAME")
                   .then(() => {
                       expect(this.room.messages).to.eql([
                           ["bot_user", "@hubot lookup some.host.name CNAME"],
                           ["hubot", "@bot_user Returning results directly from the name server (not from VinylDNS cache):\n" +
                                     "> 📋 *Record Found* 📋\n" +
                                     "> Record: `some.host.name`\n" +
                                     "> Type: `CNAME`\n" +
                                     "> TTL: `7200`\n" +
                                     "> Value: `96.115.224.66`\n\n\n"]
                       ]);
                   })
    });

    it("should return response when no answers found", () => {
        sinon.restore();
        sinon.stub(DigService.prototype, 'performLookup').callsFake((a, b) => new Promise(resolve => resolve({
            "header": [
                ["; <<>> DiG 9.16.0 <<>> @dns101.foo.net " + a + " " + b],
                ["; (2 servers found)"],
                [";; global options: +cmd"],
                [";; Got answer:"],
                [";; ->>HEADER<<- opcode: QUERY, status: NXDOMAIN, id: 17951"],
                [";; flags: qr aa rd; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1"],
                [";; WARNING: recursion requested but not available"]
            ]
        })));
        return this.room.user
                   .say("bot_user", "@hubot lookup some.host.name CNAME")
                   .then(() => {
                       expect(this.room.messages).to.eql([
                               ["bot_user", "@hubot lookup some.host.name CNAME"],
                               ["hubot", "@bot_user No results found.  The server returned `;; ->>HEADER<<- opcode: QUERY, status: NXDOMAIN, id: 17951`"]
                           ]
                       );
                   })
    });

    it("should accept AAAA requests and not stop on the first A in the regex", () => {
        return this.room.user
                   .say("bot_user", "@hubot lookup some.host.name AAAA")
                   .then(() => {
                       expect(this.room.messages).to.eql([
                           ["bot_user", "@hubot lookup some.host.name AAAA"],
                           ["hubot", "@bot_user Returning results directly from the name server (not from VinylDNS cache):\n" +
                                     "> 📋 *Record Found* 📋\n" +
                                     "> Record: `some.host.name`\n" +
                                     "> Type: `AAAA`\n" +
                                     "> TTL: `7200`\n" +
                                     "> Value: `96.115.224.66`\n\n\n"]
                       ]);
                   })
    });
});
