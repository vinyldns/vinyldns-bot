'use strict';
const vinyldns_config = require("../../config/vinyldns-config");
const {isNotNullOrEmpty, getValueOrDefault} = require("../util");
const VinylDNS = require("vinyldns-js");
const logger = require("../logger").forType("VinylDnsService");

/**
 * Service for interfacing with VinylDNS
 */
class VinylDnsService {
    /**
     * @param {string} [apiUri]
     * @param {string} [apiKey]
     * @param {string} [apiSecret]
     */
    constructor(apiUri, apiKey, apiSecret) {
        this._apiUri = getValueOrDefault(apiUri, vinyldns_config.vinyldns_config.api_uri);
        this._apiKey = getValueOrDefault(apiKey, vinyldns_config.vinyldns_config.api_key);
        this._apiSecret = getValueOrDefault(apiSecret, vinyldns_config.vinyldns_config.api_secret);

        this._client = new VinylDNS({
            apiUrl: this._apiUri,
            accessKeyId: this._apiKey,
            secretAccessKey: this._apiSecret
        });
    }

    /**
     * Finds the owner of a record for a given FQDN.
     * @param {string} fqdn - The fully qualified domain name.
     * @param {string} [recordType] - The optional record type to filter by
     *
     * @returns Promise<{{errors: string[], ownerGroup: {name:string,email:string}, zone: {name:string,email:string,id:string}, records: [{type:string,name:string,status:string,id:string}]}}>
     */
    async findOwnerByFqdn(fqdn, recordType) {
        const pattern = /^([a-z0-9-]+)\.(.*)+$/i
        if (!pattern.test(fqdn)) {
            return null;
        }
        let parts = fqdn.match(pattern)
        let record = parts[1];
        let zone = parts[2];

        let response = {errors: [], zone: {}, records: [], ownerGroup: {}, isZone: true, isSharedZone: false, hasOwner: false}
        let zoneData = await this._safeEval(async () => this._client.getZoneByName(fqdn), async () => {
            response.isZone = false;
            return this._safeEval(async () => this._client.getZoneByName(zone), async e => {
                logger.warn(`Error loading zone data for '${zone}'`, e);
                response.errors.push(`Unknown zone: '${zone}'`)
            });
        });

        if (isNotNullOrEmpty(zoneData)) {
            response.zone = zoneData.zone;

            // If the request was for an actual zone and not a single record, or the record is in a private zone, return zone contact info
            const isPrivateZone = isNotNullOrEmpty(zoneData.zone.shared) && !zoneData.zone.shared;
            response.isSharedZone = response.isZone && zoneData.zone.shared === true;
            if (response.isZone || isPrivateZone) {
                response.hasOwner = true;
                if (zoneData.zone.shared === true) {
                    response.ownerGroup = {name: "Shared Zone", email: "NA"};
                } else {
                    response.ownerGroup = await this._safeEval(async () => this._client.getGroup(zoneData.zone.adminGroupId), async e => {
                        logger.warn(`Error loading group by group id '${zoneData.zone.adminGroupId}'`, e);
                    });
                    response.ownerGroup.email = getValueOrDefault(zoneData.zone.email, response.ownerGroup.email);
                }
                return response;
            }

            let filter = {recordNameFilter: record, startFrom: 0, maxItems: 1};
            if (isNotNullOrEmpty(recordType)) {
                filter.recordTypeFilter = recordType;
            }
            let recordData = await this._safeEval(async () => this._client.getRecordSets(zoneData.zone.id, filter), async e => {
                logger.warn(`Error loading record set data for '${fqdn}'`, e);
                response.errors.push(`Unknown record set: '${fqdn}'`)
            });
            if (isNotNullOrEmpty(recordData) && isNotNullOrEmpty(recordData.recordSets)) {
                if (recordData.recordSets.length === 0) {
                    response.errors.push(`No records exist for '${fqdn}'`);
                } else {
                    response.records = recordData.recordSets;
                    if (isNotNullOrEmpty(recordData.recordSets[0].ownerGroupId)) {
                        response.hasOwner = true;
                        response.ownerGroup = await this._safeEval(async () => this._client.getGroup(recordData.recordSets[0].ownerGroupId), async e => {
                            response.hasOwner = false;
                            logger.warn(`Error loading group by group id '${recordData.recordSets[0].ownerGroupId}'`, e);
                            response.errors.push(`Unknown group: '${recordData.recordSets[0].ownerGroupId}'`)
                        });
                    }
                }
            }
        }
        return response;
    }

    /**
     * @private
     * @param {function():object} f
     * @param {function(Error)} onFail - failure handler
     * @returns {(object|null)}
     */
    async _safeEval(f, onFail) {
        try {
            return await f();
        } catch (e) {
            return await onFail(e);
        }
    }
}

module.exports = VinylDnsService;
