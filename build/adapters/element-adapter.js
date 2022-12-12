"use strict";
/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElementWdioAdapter = void 0;
const core_1 = require("@utam/core");
const wdio_utils_1 = require("../utils/wdio-utils");
const PROPERTY_ALIASES = new Map([
    ['class', 'className'],
    ['readonly', 'readOnly'],
]);
const BOOLEAN_PROPERTIES = new Set([
    'allowfullscreen',
    'allowpaymentrequest',
    'allowusermedia',
    'async',
    'autofocus',
    'autoplay',
    'checked',
    'compact',
    'complete',
    'controls',
    'declare',
    'default',
    'defaultchecked',
    'defaultselected',
    'defer',
    'disabled',
    'ended',
    'formnovalidate',
    'hidden',
    'indeterminate',
    'iscontenteditable',
    'ismap',
    'itemscope',
    'loop',
    'multiple',
    'muted',
    'nohref',
    'nomodule',
    'noresize',
    'noshade',
    'novalidate',
    'nowrap',
    'open',
    'paused',
    'playsinline',
    'pubdate',
    'readonly',
    'required',
    'reversed',
    'scoped',
    'seamless',
    'seeking',
    'selected',
    'truespeed',
    'typemustmatch',
    'willvalidate',
]);
const STYLE_ATTRIBUTE_SCRIPT = "var style = arguments[0]['style']; if (style && !(typeof style === 'string' || style instanceof String)) { return style.cssText; } return style;";
const SELECTED_ATTRIBUTE_SCRIPT = "if (arguments[0].tagName.toLowerCase() === 'option' || (arguments[0].tagName.toLowerCase() === 'input' && arguments[0].type && (arguments[0].type.toLowerCase() === 'checkbox' || arguments[0].type.toLowerCase() === 'radio'))) { let type = arguments[0].type && arguments[0].type.toLowerCase(); let propertyName = type === 'checkbox' || type === 'radio' ? 'checked' : 'selected'; return {'isValid': true, 'value': !!arguments[0][propertyName] ? 'true' : null}; } return {'isValid': false, 'value': null};";
const PATHED_ATTRIBUTE_SCRIPT = "if (arguments[0].tagName.toLowerCase() !== arguments[2]) { return {'isValid': false, 'value': null}; }; var attr = arguments[0].getAttributeNode(arguments[1]); if (attr && attr.specified) { return {'isValid': true, 'value': arguments[0][arguments[1]]}; } return {'isValid': true, 'value': null};";
const GET_ATTRIBUTE_SCRIPTS = new Map()
    .set('style', STYLE_ATTRIBUTE_SCRIPT)
    .set('selected', SELECTED_ATTRIBUTE_SCRIPT)
    .set('pathedAttr', PATHED_ATTRIBUTE_SCRIPT);
const IS_PARENT_NODE_SHADOW_ROOT_SCRIPT = 'return arguments[0].getRootNode() instanceof ShadowRoot;';
const ROOT_NODE_GET_ACTIVE_ELEMENT_SCTIPT = 'return arguments[0].getRootNode().activeElement';
class ElementWdioAdapter {
    constructor(element, driver) {
        this.instanceIdentity = ElementWdioAdapter.classIdentity;
        this.element = element;
        this.driver = driver;
    }
    /**
     * transforms wdio element into adapter. should override for other adapters
     * @param element wdio element
     * @returns new element object
     */
    __supplier__(element) {
        return new ElementWdioAdapter(element, this.driver);
    }
    async findElement(locator) {
        return (await this.findElements(locator))[0];
    }
    async findElements(locator) {
        const selectorStr = wdio_utils_1.buildWdioSelector(locator);
        const elements = await this.element.$$(selectorStr);
        // according to https://github.com/webdriverio/webdriverio/issues/7307 WDIO does not throw if element not found
        if (!elements?.length) {
            throw new Error(`Can't find elements with locator '${selectorStr}' inside its scope element.`);
        }
        return elements.map((element) => this.__supplier__(element));
    }
    getText() {
        return this.element.getText();
    }
    async getCssValue(cssStyleProperty) {
        const result = await this.element.getCSSProperty(cssStyleProperty);
        return result.value ?? '';
    }
    async getAttribute(attributeName) {
        const name = attributeName.toLowerCase();
        switch (name) {
            case 'style':
                // Special case for the style attribute/property. Script uses the
                // property value. If the value is a string, that is returned;
                // otherwise, return the cssText property of the object returned
                // by the style property.
                return this.driver.executeScript(GET_ATTRIBUTE_SCRIPTS.get(name) || '', this);
            case 'checked':
            case 'selected': {
                // Special case for checked and selected attributes. Script only
                // applies to <option> elements, and <input type="checkbox"> and
                // <input type="radio"> elements. For <option> elements, it checks
                // the selected property, and for <input> elements, it checks the
                // checked property. If the property does not exists, or returns
                // undefined, it uses the !! operator to coerce the value to a
                // boolean, then returns the string "true" for true, or null for
                // any other case, as is the contract for the getAttribute method.
                // The script returns a raw JavaScript object, so we legitimately
                // need to declare the return type as "any".
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const scriptResult = await this.driver.executeScript(GET_ATTRIBUTE_SCRIPTS.get('selected') || '', this);
                if (scriptResult['isValid']) {
                    const scriptValue = scriptResult['value'];
                    return scriptValue ? scriptValue.toString() : null;
                }
                break;
            }
            case 'src': {
                // Special case for the src attribute, which only applies to <img>
                // elements. The attribute can contain a relative path. For
                // consistency, if the attribute is specified, return the value of
                // the src property, which contains an absoulte path.
                // The script returns a raw JavaScript object, so we legitimately
                // need to declare the return type as "any".
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const scriptResult = await this.driver.executeScript(GET_ATTRIBUTE_SCRIPTS.get('pathedAttr') || '', this, name, 'img');
                if (scriptResult['isValid']) {
                    const scriptValue = scriptResult['value'];
                    return scriptValue ? scriptValue.toString() : null;
                }
                break;
            }
            case 'href': {
                // Special case for the href attribute, which only applies to <a>
                // elements. The attribute can contain a relative path. For
                // consistency, if the attribute is specified, return the value of
                // the href property, which contains an absoulte path.
                // The script returns a raw JavaScript object, so we legitimately
                // need to declare the return type as "any".
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const scriptResult = await this.driver.executeScript(GET_ATTRIBUTE_SCRIPTS.get('pathedAttr') || '', this, name, 'a');
                if (scriptResult['isValid']) {
                    const scriptValue = scriptResult['value'];
                    return scriptValue ? scriptValue.toString() : null;
                }
                break;
            }
            case 'spellcheck': {
                // Special case for the spellcheck attribute. This attribute is
                // not a boolean attribute, but rather is enumerated, and can have
                // values other than "true" and "false".
                const spellcheckAttr = await this.element.getAttribute(name);
                if (spellcheckAttr !== null) {
                    if (spellcheckAttr.toLowerCase() === 'false') {
                        return 'false';
                    }
                    else if (spellcheckAttr.toLowerCase() === 'true') {
                        return 'true';
                    }
                }
                // Coerce the property value to a string, even if it is null or undefined.
                const spellcheckProp = await this.element.getProperty(name);
                return spellcheckProp + '';
            }
        }
        // Special case for boolean attributes. If the attribute is a boolean attribute,
        // as defined in the list above, check the attribute value first, and then check
        // the property value. Coerce the value so that we return the string "true" for
        // true, or null for any other case, as is the contract for the getAttribute method.
        const propName = PROPERTY_ALIASES.get(attributeName) ?? attributeName;
        if (BOOLEAN_PROPERTIES.has(name)) {
            const boolValue = (await this.element.getAttribute(attributeName)) !== null || (await this.element.getProperty(propName));
            return boolValue ? 'true' : null;
        }
        // General case: Use the value of the property. If the property is undefined,
        // or null, or is an object, use the value of the attribute. Note that getAttribute
        // will return null if the attribute does not exist.
        let property = null;
        try {
            property = await this.element.getProperty(propName);
        }
        catch (e) {
            // Leaves property undefined or null
        }
        // 1- Call getAttribute if getProperty fails, i.e. property is null or undefined.
        // 2- When property is an object we fall back to the actual attribute instead.
        const value = property === undefined || property === null || typeof property === 'object'
            ? await this.element.getAttribute(attributeName)
            : property;
        // The empty string is a valid return value.
        return value !== undefined && value !== null ? value.toString() : null;
    }
    async getRect() {
        const location = await this.element.getLocation();
        const size = await this.element.getSize();
        return { height: size.height, width: size.width, x: location.x, y: location.y };
    }
    isDisplayed() {
        return this.element.isDisplayed();
    }
    isEnabled() {
        return this.element.isEnabled();
    }
    isExisting() {
        return core_1.isElementAttachedToDom(this.driver, this);
    }
    async hasFocus() {
        // 1. check if current element's parent is shadowRoot
        // return arguments[0].getRootNode() instanceof ShadowRoot";
        const isShadowHost = await this.driver.executeScript(IS_PARENT_NODE_SHADOW_ROOT_SCRIPT, this);
        if (isShadowHost) {
            // 2. get active element from shadowRoot
            // return arguments[0].getRootNode().activeElement;
            const activeElement = await this.driver.executeScript(ROOT_NODE_GET_ACTIVE_ELEMENT_SCTIPT, this);
            if (activeElement) {
                //active element can be null
                // check if current element is same as active element
                const currentElementId = this.element.elementId;
                const activeElementId = activeElement.element.elementId;
                return currentElementId === activeElementId;
            }
        }
        return this.element.isFocused();
    }
    click() {
        return this.element.click();
    }
    doubleClick() {
        return this.element.doubleClick();
    }
    rightClick() {
        return this.element.click({ button: 'right' });
    }
    // based on commands in https://github.com/webdriverio/webdriverio/blob/v7/packages/webdriverio/src/commands/element/click.ts
    // works only for webdriver protocol
    async clickAndHold(durationSec) {
        await this.moveTo();
        const browser = this.driver.browser;
        const holdDuration = durationSec ? durationSec * 1000 : 0;
        await browser.performActions([
            {
                type: 'pointer',
                id: 'pointer1',
                parameters: { pointerType: 'mouse' },
                actions: [
                    // button 0 is left mouse button
                    { type: 'pointerDown', button: 0 },
                    { type: 'pause', duration: holdDuration },
                    { type: 'pointerUp', button: 0 },
                ],
            },
        ]);
        await browser.releaseActions();
    }
    clearValue() {
        return this.element.clearValue();
    }
    addValue(arg) {
        return this.element.addValue(arg);
    }
    setValue(arg) {
        return this.element.setValue(arg);
    }
    getValue() {
        return this.element.getValue();
    }
    scrollIntoView(arg) {
        return this.element.scrollIntoView(arg);
    }
    moveTo(options) {
        return this.element.moveTo(options);
    }
    static isWdioElement(element) {
        return element.instanceIdentity === ElementWdioAdapter.classIdentity;
    }
    /**
     * Check if the element invoking the function contains the element designed by the locator
     * Note: This function actually consumes a lower-level API, findElementFromElement that is exposed through the
     * webdriver package. It's not part of the set of API provided by the WDIO framework but comes from a lower
     * layer implementation of the WebDriver protocol. This won't work with mobile locators as this API only
     * supports the locator strategies defined in the WebDriver spec.
     *
     * @see https://www.w3.org/TR/webdriver/#locator-strategies
     * @todo add if statement that check that using === 'css selector' and uses the findElementFromElement
     * @todo add else clause and consume a wdio API compatible with mobile locator strategies this.element.
     *
     * @param locator element locator strategy and selector
     * @returns true if the element matching the locator can be find from the element calling the function
     */
    async containsElement(locator) {
        return (await this.containsElements(locator)) > 0;
    }
    /**
     * Check if the element invoking the function contains the elements designed by the locator
     * Note: This function actually consumes a lower-level API, findElementFromElement that is exposed through the
     * webdriver package. It's not part of the set of API provided by the WDIO framework but comes from a lower
     * layer implementation of the WebDriver protocol. This won't work with mobile locators as this API only
     * supports the locator strategies defined in the WebDriver spec.
     *
     * @see https://www.w3.org/TR/webdriver/#locator-strategies
     * @todo add if statement that check that using === 'css selector' and uses the findElementFromElement
     * @todo add else clause and consume a wdio API compatible with mobile locator strategies this.element.
     *
     * @param locator element locator strategy and selector
     * @returns the number of elements found
     */
    async containsElements(locator) {
        const selectorStr = wdio_utils_1.buildWdioSelector(locator);
        // according to https://github.com/webdriverio/webdriverio/issues/7307 WDIO does not throw if element not found
        const elements = await this.element.$$(selectorStr);
        if (!elements?.length) {
            return 0;
        }
        return elements.length;
    }
    async dragAndDrop(target, durationSec) {
        const options = durationSec ? { duration: durationSec * 1000 } : undefined;
        const { element, offset } = target;
        if (element) {
            const destination = element.element;
            return this.element.dragAndDrop(destination, options);
        }
        if (offset) {
            return this.element.dragAndDrop(offset, options);
        }
        throw new Error('dragAndDrop action requires destination parameter');
    }
    async flick(offset) {
        throw new Error('flick action is supported only for mobile element');
    }
    async blur() {
        await this.driver.executeScript(function (el) {
            el.blur();
            return el;
        }, this);
    }
    async focus() {
        await this.driver.executeScript(function (el) {
            el.focus();
            return el;
        }, this);
    }
}
exports.ElementWdioAdapter = ElementWdioAdapter;
// We need this due to "identity discontinuity" in webdriverio
// where the code might be evaluated in a different realm (instanceof wont work)
ElementWdioAdapter.classIdentity = '__webelement_adapter__';
//# sourceMappingURL=element-adapter.js.map