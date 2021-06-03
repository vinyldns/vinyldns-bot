'use strict';

const {describe, it} = require('mocha');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));

const VinylDNS = require("vinyldns-js");
const {VinylDnsService} = require("../scripts/lib");
const {sinon} = require("./shared");

describe('VinylDNS Service', () => {
    beforeEach(() => {
        sinon.stub(VinylDNS.prototype, "getZoneByName").get(() => (zoneName) => new Promise((resolve, reject) => {
            // Record is not a zone
            if (zoneName === "fqdn.foo.com") {
                reject("Error")
            }
            resolve({
                zone: {id: "some_zone_id", name: zoneName}
            })
        }));
        sinon.stub(VinylDNS.prototype, "getRecordSets").get(() => (zoneId, options) => new Promise(resolve => resolve({
            recordSets: [{zoneId: zoneId, id: "some_id", name: options.recordNameFilter, ownerGroupId: "some_owner_group_id", ownerGroupName: "SomeOwnerGroupName"}]
        })));
        sinon.stub(VinylDNS.prototype, "getGroup").get(() => (ownerGroupId) => new Promise(resolve => resolve({
            id: ownerGroupId, name: "SomeOwnerGroupName", email: "some@email.com"
        })));
    })
    afterEach(() => {
        sinon.reset()
    });

    it("should find a record in the zone of a FQDN if present", async () => {
        await expect(new VinylDnsService().findOwnerByFqdn("fqdn.foo.com")).to.eventually.eql({
            "errors": [],
            "hasOwner": true,
            "isSharedZone": false,
            "isZone": false,
            "ownerGroup": {
                "email": "some@email.com",
                "id": "some_owner_group_id",
                "name": "SomeOwnerGroupName",
            },
            "records": [
                {
                    "id": "some_id",
                    "name": "fqdn",
                    "ownerGroupId": "some_owner_group_id",
                    "ownerGroupName": "SomeOwnerGroupName",
                    "zoneId": "some_zone_id",
                }
            ],
            "zone": {
                "id": "some_zone_id",
                "name": "foo.com",
            }
        });
    });

    it("should return error if getRecordSets fails", async () => {
        sinon.stub(VinylDNS.prototype, "getRecordSets").get(() => (zoneId, options) => new Promise((resolve, reject) => reject("Error")));

        await expect(new VinylDnsService().findOwnerByFqdn("fqdn.foo.com")).to.eventually.eql({
            "errors": ["Unknown record set: 'fqdn.foo.com'"],
            "hasOwner": false,
            "isSharedZone": false,
            "isZone": false,
            "ownerGroup": {},
            "records": [],
            "zone": {
                "id": "some_zone_id",
                "name": "foo.com"
            }
        });
    });

    it("should return error of getZoneByName fails", async () => {
        sinon.stub(VinylDNS.prototype, "getZoneByName").get(() => (zoneName) => new Promise((resolve, reject) => reject("Error")));

        await expect(new VinylDnsService().findOwnerByFqdn("fqdn.foo.com")).to.eventually.eql({
            "errors": ["Unknown zone: 'foo.com'"],
            "hasOwner": false,
            "isSharedZone": false,
            "isZone": false,
            "ownerGroup": {},
            "records": [],
            "zone": {}
        });
    });

    it("should return error of getGroup fails", async () => {
        sinon.stub(VinylDNS.prototype, "getGroup").get(() => (ownerGroupId) => new Promise((resolve, reject) => reject("Error")));
        await expect(new VinylDnsService().findOwnerByFqdn("fqdn.foo.com")).to.eventually.eql({
            "errors": ["Unknown group: 'some_owner_group_id'"],
            "ownerGroup": undefined,
            "hasOwner": false,
            "isSharedZone": false,
            "isZone": false,
            "records": [
                {
                    "id": "some_id",
                    "name": "fqdn",
                    "ownerGroupId": "some_owner_group_id",
                    "ownerGroupName": "SomeOwnerGroupName",
                    "zoneId": "some_zone_id"
                }
            ],
            "zone": {
                "id": "some_zone_id",
                "name": "foo.com"
            }
        });
    });

    it("should find zone if FQDN is a managed zone", async () => {
        sinon.stub(VinylDNS.prototype, "getZoneByName").get(() => (zoneName) => new Promise((resolve, reject) => {
            // Record is a zone
            resolve({
                zone: {id: "some_zone_id", name: zoneName, email: "owner@zone.com", adminGroupId: "some_admin_group_id"}
            })
        }));
        await expect(new VinylDnsService().findOwnerByFqdn("fqdn.foo.com")).to.eventually.eql({
            "errors": [],
            "hasOwner": true,
            "isSharedZone": false,
            "isZone": true,
            "ownerGroup": {
                "email": "owner@zone.com",
                "id": "some_admin_group_id",
                "name": "SomeOwnerGroupName",
            },
            "records": [],
            "zone": {
                "adminGroupId": "some_admin_group_id",
                "email": "owner@zone.com",
                "id": "some_zone_id",
                "name": "fqdn.foo.com",
            }
        });
    });

    it("should return shared zone owner for shared zone", async () => {
        sinon.stub(VinylDNS.prototype, "getZoneByName").get(() => (zoneName) => new Promise((resolve, reject) => {
            // Record is a zone
            resolve({
                zone: {id: "some_zone_id", name: zoneName, email: "owner@zone.com", shared: true, adminGroupId: "some_admin_group_id"}
            })
        }));
        await expect(new VinylDnsService().findOwnerByFqdn("fqdn.foo.com")).to.eventually.eql({
            "errors": [],
            "hasOwner": true,
            "isSharedZone": true,
            "isZone": true,
            "ownerGroup": {
                "email": "NA",
                "name": "Shared Zone",
            },
            "records": [],
            "zone": {
                "adminGroupId": "some_admin_group_id",
                "email": "owner@zone.com",
                "id": "some_zone_id",
                "name": "fqdn.foo.com",
                "shared": true
            }
        });
    });

    it("should send record name filter to recordset call", async () => {
        let request = {};
        sinon.stub(VinylDNS.prototype, "getRecordSets").get(() => (zoneId, options) => {
            request.options = options;
            return new Promise(resolve => resolve({
                recordSets: [{zoneId: zoneId, id: "some_id", name: options.recordNameFilter, ownerGroupId: "some_owner_group_id", ownerGroupName: "SomeOwnerGroupName"}]
            }))
        });
        await new VinylDnsService().findOwnerByFqdn("fqdn.foo.com");
        await expect(request.options).to.eql({
            "maxItems": 1,
            "recordNameFilter": "fqdn",
            "startFrom": 0
        });
    });

    it("should send record type filter to recordset call", async () => {
        let request = {};
        sinon.stub(VinylDNS.prototype, "getRecordSets").get(() => (zoneId, options) => {
            request.options = options;
            return new Promise(resolve => resolve({
                recordSets: [{zoneId: zoneId, id: "some_id", name: options.recordNameFilter, ownerGroupId: "some_owner_group_id", ownerGroupName: "SomeOwnerGroupName"}]
            }))
        });
        await new VinylDnsService().findOwnerByFqdn("fqdn.foo.com", "A");
        await expect(request.options).to.eql({
            "maxItems": 1,
            "recordNameFilter": "fqdn",
            "recordTypeFilter": "A",
            "startFrom": 0
        });
    });

    it("should return error if no record sets", async () => {
        sinon.stub(VinylDNS.prototype, "getRecordSets").get(() => (zoneId, options) => new Promise(resolve => resolve({
            recordSets: []
        })));
        await expect(new VinylDnsService().findOwnerByFqdn("fqdn.foo.com")).to.eventually.eql({
            "errors": ["No records exist for 'fqdn.foo.com'"],
            "hasOwner": false,
            "isSharedZone": false,
            "isZone": false,
            "ownerGroup": {},
            "records": [],
            "zone": {
                "id": "some_zone_id",
                "name": "foo.com"
            }
        });
    });
});
