'use strict';

function isNullOrEmpty(obj) {
    return obj == null || typeof obj == "undefined";
}

function isNotNullOrEmpty(obj) {
    return !isNullOrEmpty(obj);
}

function getValueOrDefault(obj, defaultValue) {
    if (isNotNullOrEmpty(obj)) {
        return obj;
    }
    return defaultValue;
}

function flatMap(mapFunc, arr) {
    return arr.map(mapFunc).reduce((x, y) => x.concat(y), [])
}

module.exports = {
    isNullOrEmpty,
    isNotNullOrEmpty,
    getValueOrDefault,
    flatMap
};