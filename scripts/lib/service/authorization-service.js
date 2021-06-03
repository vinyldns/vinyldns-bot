'use strict';

const {authorization_config} = require("../../config");

class AuthorizationService {
    /**
     * Returns true if the given userId has access to the given resource.
     *
     * @param resource {string} - The resource to access.
     * @param userId {string} - The user.
     * @returns {boolean} - True if the user has access; false otherwise.
     */
    hasAccess(resource, userId) {
        return !authorization_config.has(resource) || authorization_config.get(resource).has(userId);
    }

    /**
     * Determines whether the given resource requires authorization.
     *
     * @param resource {string} - The resource to check.
     * @returns {boolean} - True if restricted; false otherwise.
     */
    isRestricted(resource) {
        return authorization_config.has(resource);
    }
}

module.exports = AuthorizationService;