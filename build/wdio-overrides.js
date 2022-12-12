"use strict";
/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.monkeyPatchBrowserObject = exports.monkeyPatchShadow = void 0;
/* eslint-disable @typescript-eslint/no-var-requires */
function monkeyPatchShadow(browser) {
    // -- method: shadow$ ----------------------------------------------------------
    const elementProto = require('webdriverio/build/commands/element');
    if (!elementProto._monkeyPatched) {
        elementProto._monkeyPatched = true;
        // Monkey patch the element's shadow method
        elementProto.shadow$ = async function _monkeyPatchedShadow$(selector) {
            const { sessionMap } = require('devtools');
            const { ELEMENT_KEY } = require('webdriverio/build/constants');
            const sessionObj = sessionMap.get(browser.sessionId);
            const driver = sessionObj.session;
            const elementStore = driver.elementStore;
            const elementReference = this[ELEMENT_KEY];
            const puppeteerHandle = elementStore.get(elementReference);
            const elementHandle = await puppeteerHandle.evaluateHandle(function (element, selector) {
                if (element.shadowRoot) {
                    return element.shadowRoot.querySelector(selector);
                }
            }, puppeteerHandle, selector);
            if (!elementHandle) {
                throw new Error('Unable to find a shadowRoot within this element');
            }
            // Creates a copy of this element to not mutate the original one
            const elementCopy = (await browser.$(this));
            // Set the element internals to the new ElementHandle recovered
            const newElementReference = elementStore.set(elementHandle);
            elementCopy[ELEMENT_KEY] = newElementReference;
            elementCopy.elementId = newElementReference;
            return elementCopy;
        };
        // Monkey patch the element's shadow method
        elementProto.shadow$$ = async function _monkeyPatchedShadow$$(selector) {
            const { sessionMap } = require('devtools');
            const { ELEMENT_KEY } = require('webdriverio/build/constants');
            const sessionObj = sessionMap.get(browser.sessionId);
            const driver = sessionObj.session;
            const elementStore = driver.elementStore;
            const elementReference = this[ELEMENT_KEY];
            const puppeteerHandle = elementStore.get(elementReference);
            const elementsHandle = await puppeteerHandle.evaluateHandle(function (element, selector) {
                if (element.shadowRoot) {
                    return element.shadowRoot.querySelectorAll(selector);
                }
            }, puppeteerHandle, selector);
            if (!elementsHandle) {
                throw new Error('Unable to find a shadowRoot within this element');
            }
            const properties = await elementsHandle.getProperties();
            await elementsHandle.dispose();
            const result = [];
            for (const property of properties.values()) {
                const elementHandle = property.asElement();
                if (elementHandle) {
                    const newElementReference = elementStore.set(elementHandle);
                    const jsonElement = { [ELEMENT_KEY]: newElementReference };
                    result.push(jsonElement);
                }
            }
            if (result.length === 0) {
                throw new Error('Unable to find elements within shadow root');
            }
            return Promise.all(result.map(async (elementHandle) => {
                // Creates a copy of this element to not mutate the original one
                const elementCopy = (await browser.$(this));
                // Set the element internals to the new ElementHandle recovered
                const newElementReference = elementStore.set(elementHandle);
                elementCopy[ELEMENT_KEY] = newElementReference;
                elementCopy.elementId = newElementReference;
                return elementCopy;
            }));
        };
    }
}
exports.monkeyPatchShadow = monkeyPatchShadow;
function monkeyPatchBrowserObject() {
    const browserProto = require('webdriverio/build/commands/browser');
    if (!browserProto._monkeyPatched) {
        browserProto._monkeyPatched = true;
        browserProto.execute = async function _monkeyPatchExecute(script, ...args) {
            const { sessionMap } = require('devtools');
            const { ELEMENT_KEY } = require('webdriverio/build/constants');
            // get the pupeteer instance
            const puppeteer = await this.getPuppeteer();
            const pages = await puppeteer.pages();
            const page = pages[0];
            // Get access to internal puppeteer JSHandlers store from wdio
            const sessionObj = sessionMap.get(browser.sessionId);
            const driver = sessionObj.session;
            const elementStore = driver.elementStore;
            // Normalize arguments to comply with puppeteer serialization algo
            try {
                const normalizedArgs = await Promise.all(args.map((arg) => (arg[ELEMENT_KEY] ? elementStore.get(arg[ELEMENT_KEY]) : arg)));
                const jsHandle = await page.evaluateHandle(script, ...normalizedArgs);
                const elementHandle = jsHandle.asElement();
                if (elementHandle) {
                    const newElementReference = elementStore.set(elementHandle);
                    const jsonElement = { [ELEMENT_KEY]: newElementReference };
                    return jsonElement;
                }
                else {
                    const result = [];
                    // FIXME: File an issue againts pupeteer to be able to observe
                    // via public API the type of object a handler holds rather than private fields
                    const isRemoteObject = !!jsHandle._remoteObject.objectId;
                    if (isRemoteObject) {
                        const properties = await jsHandle.getProperties();
                        await jsHandle.dispose();
                        for (const property of properties.values()) {
                            const elementHandle = property.asElement();
                            if (elementHandle) {
                                const newElementReference = elementStore.set(elementHandle);
                                const jsonElement = { [ELEMENT_KEY]: newElementReference };
                                result.push(jsonElement);
                            }
                        }
                        return result;
                    }
                    else {
                        return jsHandle.jsonValue();
                    }
                }
            }
            catch (error) {
                // TODO: Narrow the error
                if (error.message.includes('context was destroyed')) {
                    error.name = 'stale element reference';
                }
                throw error;
            }
        };
    }
}
exports.monkeyPatchBrowserObject = monkeyPatchBrowserObject;
//# sourceMappingURL=wdio-overrides.js.map