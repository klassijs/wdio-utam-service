"use strict";
/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasDuplicatedKeys = exports.isProfile = exports.isProfileConfiguration = exports.isString = void 0;
function isString(x) {
    return typeof x === 'string';
}
exports.isString = isString;
function isObject(x) {
    return typeof x === 'object' && x !== null;
}
function isArray(x) {
    return Array.isArray(x);
}
function isProfileConfiguration(x) {
    return !!(x &&
        isObject(x) &&
        'name' in x &&
        isString(x.name) &&
        'values' in x &&
        isArray(x.values));
}
exports.isProfileConfiguration = isProfileConfiguration;
function isProfile(x) {
    return isArray(x) && x.every((i) => isProfileConfiguration(i));
}
exports.isProfile = isProfile;
function hasDuplicatedKeys(profiles) {
    const uniqueProfileNames = new Set(profiles.map(({ name }) => name));
    return profiles.length !== uniqueProfileNames.size;
}
exports.hasDuplicatedKeys = hasDuplicatedKeys;
//# sourceMappingURL=config-validations.js.map