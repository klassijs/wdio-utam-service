"use strict";
/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverWdioAdapter = void 0;
const utam_1 = require("utam");
const element_adapter_1 = require("./element-adapter");
const wdio_utils_1 = require("../utils/wdio-utils");
class DriverWdioAdapter {
    constructor(browser, config) {
        this.browser = browser;
        this.config = config;
        // enforce implicit timeout set for UTAM to be used in wdio for $ and $$ (find operations)
        browser.setTimeout({ implicit: this.config.implicitTimeout });
    }
    /**
     * transforms wdio element into adapter. should override for other adapters
     * @param element wdio element
     * @returns new element object
     */
    __supplier__(element) {
        return new element_adapter_1.ElementWdioAdapter(element, this);
    }
    async executeScript(script, ...args) {
        const { browser } = this;
        // The last argument my hold specific semantics from UTAM, if so remove it.
        const shadowGetElementOperation = args[args.length - 1] === utam_1.REIFY_SHADOW_ELEMENT_CONSTANT;
        if (shadowGetElementOperation) {
            // remove the special argument
            args.splice(-1, 1);
        }
        const unwrappedArgs = args.map((arg) => (element_adapter_1.ElementWdioAdapter.isWdioElement(arg) ? arg.element : arg));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawResult = await this.browser.execute.apply(browser, [script, ...unwrappedArgs]);
        if (wdio_utils_1.isReifiableElement(rawResult)) {
            // If we are in a shadow operation, get the selector from the last argument
            const selector = shadowGetElementOperation
                ? unwrappedArgs[unwrappedArgs.length - 1]
                : undefined;
            const elements = await wdio_utils_1.reify(this.browser, rawResult, { selector });
            if (Array.isArray(elements)) {
                const elementsAdapter = elements.map((e) => this.__supplier__(e));
                return elementsAdapter;
            }
            else {
                const elementAdapter = this.__supplier__(elements);
                return elementAdapter;
            }
        }
        return rawResult;
    }
    async findElement(locator) {
        return (await this.findElements(locator))[0];
    }
    async findElements(locator) {
        const by = utam_1.checkLocator(locator);
        const { using, value } = by;
        const selectorStr = wdio_utils_1.buildWdioSelector(locator);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const elements = (await this.browser.findElements(using, value));
        // according to https://github.com/webdriverio/webdriverio/issues/7307 WDIO does not throw if element not found
        if (!elements?.length) {
            throw new Error(`Can't find element with locator '${value}' in the driver root.`);
        }
        return Promise.all(elements.map(async (rawElement) => {
            const element = await wdio_utils_1.reify(this.browser, rawElement, { selector: selectorStr });
            return this.__supplier__(element);
        }));
    }
    waitFor(condition, options, ...args) {
        // interval and timeout take from method args, if not set - from driver config
        const opt_interval = options?.interval ?? this.config.pollingInterval;
        const opt_timeout = options?.timeout ?? this.config.explicitTimeout;
        return utam_1.wait(condition, {
            opt_interval,
            opt_message: options?.message,
            opt_timeout,
        }, ...args);
    }
    // -- Frame API
    async enterFrame(element) {
        const unwrappedFrameElement = element.element;
        await this.browser.switchToFrame(unwrappedFrameElement);
    }
    async exitToParentFrame() {
        await this.browser.switchToParentFrame();
    }
    async exitFrame() {
        await this.browser.switchToFrame(null);
    }
    // -- Navigation API
    /**
     * Navigate backward in the current browsing context
     * @see https://www.w3.org/TR/webdriver2/#back
     * @see https://webdriver.io/docs/api/webdriver/#back
     */
    async back() {
        await this.browser.back();
    }
    /**
     * Navigate forward in the current browsing context
     * @see https://www.w3.org/TR/webdriver2/#forward
     * @see https://webdriver.io/docs/api/webdriver/#forward
     */
    async forward() {
        await this.browser.forward();
    }
    press(key, options = { text: undefined }) {
        return this.browser.keys([key, ...(options.text || '')]);
    }
    // -- Mobile API
    setPageContextToNative() {
        throw new Error('setPageContextToNative supported only for mobile automation');
    }
    setPageContextToWebView(title) {
        throw new Error('setPageContextToWebView supported only for mobile automation');
    }
    async isNativeContext() {
        return false;
    }
    getPageContext() {
        throw new Error('getPageContext supported only for mobile automation');
    }
    setPageContext(contextType) {
        // do nothing, only needed for mobile
        return Promise.resolve();
    }
}
exports.DriverWdioAdapter = DriverWdioAdapter;
//# sourceMappingURL=driver-adapter.js.map