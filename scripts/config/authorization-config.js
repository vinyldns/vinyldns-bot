'use strict';

/** @type {Map<string, string[]>} */
const userId_map = new Map([
    ["myuser", ["mykey"]],
]);

/** @type {Map<string, string[]>} */
const groups = new Map([
    ["admins", userId_map.get("myuser")],
]);

/**
 * A map of the resource to the list of user id's permitted to access that resource.
 *
 * @type {Map<string, Set<string>>}
 */
const authorization_config = new Map([
    ["StatCommand", new Set(groups.get("admins"))],
    ["ForUserCommand", new Set(groups.get("admins"))],
    ["ResetCommand", new Set(groups.get("admins"))],
]);

module.exports = authorization_config;
