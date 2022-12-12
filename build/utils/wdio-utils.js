"use strict";
/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildWdioSelector = exports.reify = exports.isReifiableElement = void 0;
const constants_1 = require( "./wdio-utils" || "webdriverio/build/constants");
function isWdioElement(element) {
    return (Object.prototype.hasOwnProperty.call(element, 'ELEMENT') ||
        Object.prototype.hasOwnProperty.call(element, constants_1.ELEMENT_KEY));
}
function isReifiableElement(elements) {
    return elements != null && (isWdioElement(elements) || (Array.isArray(elements) && elements.some(isWdioElement)));
}
exports.isReifiableElement = isReifiableElement;
function addContext(element, { selector }) {
    if (selector) {
        element.selector = selector;
    }
    return element;
}
async function reify(browser, rawElements, context = {}) {
    if (Array.isArray(rawElements)) {
        const wdioElements = await Promise.all(rawElements.map((rawElement) => {
            rawElement[constants_1.ELEMENT_KEY] = rawElement[constants_1.ELEMENT_KEY] || rawElement.ELEMENT;
            return browser.$(rawElement);
        }));
        return wdioElements.map((w) => addContext(w, context));
    }
    else {
        rawElements[constants_1.ELEMENT_KEY] = rawElements[constants_1.ELEMENT_KEY] || rawElements.ELEMENT;
        const element = await browser.$(rawElements);
        return addContext(element, context);
    }
}
exports.reify = reify;
/**
 * Constructs the WDIO selector value based on the locator strategy.
 *
 * WDIO provides a set of unified API for querying elements: those APIs distinguish different locator strategies
 * by parsing the selector value and looking for some prefixing patterns
 *
 * @see https://webdriver.io/docs/selectors
 * @param locator utam locator strategy and value
 * @returns WDIO element query selector value
 */
function buildWdioSelector(locator) {
    const { using, value } = locator;
    let prefix;
    switch (using) {
        case 'accessibility id':
            prefix = '~';
            break;
        case '-ios class chain':
            prefix = '-ios class chain:';
            break;
        case '-android uiautomator':
            prefix = 'android=';
            break;
        default:
            prefix = '';
    }
    return `${prefix}${value}`;
}
exports.buildWdioSelector = buildWdioSelector;
//# sourceMappingURL=wdio-utils.js.map