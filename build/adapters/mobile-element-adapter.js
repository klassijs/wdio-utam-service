"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobileElementWdioAdapter = void 0;
/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const utam_1 = require("utam");
const element_adapter_1 = require("./element-adapter");
class MobileElementWdioAdapter extends element_adapter_1.ElementWdioAdapter {
    /**
     * transforms wdio element into adapter, overrides its parent's supplier
     * @param element wdio element
     * @returns new element object
     */
    __supplier__(element) {
        return new MobileElementWdioAdapter(element, this.driver);
    }
    async flick(offset) {
        const rect = await this.getRect();
        const originalStartPoint = {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2,
        };
        const originalEndPoint = {
            x: originalStartPoint.x + offset.x,
            y: originalStartPoint.y + offset.y,
        };
        const { flickStartPoint, flickEndPoint } = await this.getFlickCoordinates(originalStartPoint, originalEndPoint);
        // The Touch Action API provides the basis of all gestures that can be automated in Appium.
        // It is currently only available to native apps and can not be used to interact with webapps.
        await this.driver.setPageContextToNative();
        await this.driver.browser.touchPerform([
            {
                action: 'press',
                options: {
                    x: flickStartPoint.x,
                    y: flickStartPoint.y,
                },
            },
            {
                action: 'wait',
                options: {
                    ms: 500,
                },
            },
            {
                action: 'moveTo',
                options: {
                    x: flickEndPoint.x,
                    y: flickEndPoint.y,
                },
            },
            {
                action: 'release',
            },
        ]);
    }
    /**
     * From the original touch action press and move to points to get the actually press and move to points
     *
     * @param originalStartPoint the original touch action press point
     * @param originalEndPoint the original touch action move to point
     * @return flickStartPoint, flickEndPoint the actually touch action press and move to points
     */
    async getFlickCoordinates(originalStartPoint, originalEndPoint) {
        let nativeStartPoint = originalStartPoint;
        let nativeEndPoint = originalEndPoint;
        if (!(await this.isNative())) {
            nativeStartPoint = await this.convertWebViewLocationToNativeCoordinates(originalStartPoint);
            nativeEndPoint = await this.convertWebViewLocationToNativeCoordinates(originalEndPoint);
        }
        const flickStartPoint = await this.boundCoordinates(nativeStartPoint);
        const flickEndPoint = await this.boundCoordinates(nativeEndPoint);
        return { flickStartPoint, flickEndPoint };
    }
    /**
     * Check current context is native or not
     *
     * @return boolean, true if current context is native, otherwise is false
     */
    async isNative() {
        return (await this.driver.browser.getContext()) === 'NATIVE_APP';
    }
    /**
     * Convert a coordinates in WEB conext to a coordinates in NATIVE context
     *
     * @param location the coordinates in WEB context
     * @return the coordinates in NATIVE context
     */
    async convertWebViewLocationToNativeCoordinates(location) {
        let x = location.x;
        let y = location.y;
        if (!this.isIOS()) {
            const docDimension = await this.getWebViewDocumentSize();
            const scrollOffset = await this.getScrollOffset();
            const webViewElementRect = await (await this.getWebViewElement()).getRect();
            x = this.webViewToNative({
                coordinate: location.x,
                scrollOffset: scrollOffset.x,
                elementSize: webViewElementRect.width,
                docDimension: docDimension.width,
            });
            y = this.webViewToNative({
                coordinate: location.y,
                scrollOffset: scrollOffset.y,
                elementSize: webViewElementRect.height,
                docDimension: docDimension.height,
            });
        }
        return this.getAbsoluteCoordinates(x, y);
    }
    /**
     * Gets the dimension of window or document
     *
     * @return Dimension of window or document
     */
    async getWebViewDocumentSize() {
        let dimension = await this.driver.executeScript('return window.innerWidth || document.body.clientWidth');
        const webViewWidth = dimension !== null ? Math.trunc(dimension) : -1;
        dimension = await this.driver.executeScript('return window.innerHeight || document.body.clientHeight');
        const webViewHeight = dimension !== null ? Math.trunc(dimension) : -1;
        return { width: webViewWidth, height: webViewHeight };
    }
    /**
     * Gets the coordinate offsets caused by window offset
     *
     * @return offset coordinates
     */
    async getScrollOffset() {
        const pageXOffset = await this.driver.executeScript('return window.pageXOffset');
        const scrollOffsetX = pageXOffset === null ? -1 : Math.trunc(pageXOffset);
        const pageYOffset = await this.driver.executeScript('return window.pageYOffset');
        const scrollOffsetY = pageYOffset === null ? -1 : Math.trunc(pageYOffset);
        return { x: scrollOffsetX, y: scrollOffsetY };
    }
    /**
     * Gets the WebView element
     *
     * @return the instance of WebView element
     */
    async getWebViewElement() {
        const by = this.isIOS()
            ? utam_1.By.classChain('**/XCUIElementTypeWebView')
            : utam_1.By.uiAutomator('className("android.webkit.WebView")');
        return this.findElement(by);
    }
    /**
     * Convert coordinates in web view to coordinates in native
     * @param coordinate the coordiantion in WEB context
     * @param scrollOffset the offset coordinate of touch action
     * @param elementSize the size of element
     * @param docDimension the size of document
     * @return the converted coordinates in navtive context
     */
    webViewToNative(value) {
        return Math.trunc(((value.coordinate - value.scrollOffset) * value.elementSize) / value.docDimension);
    }
    /**
     * Calculate the absolute coordinates of the given coordinates.
     *
     * @param xWebView The x coordinate relative to the WebView
     * @param yWebView The y coordinate relative to the WebView
     * @return The absolute position of the target
     */
    async getAbsoluteCoordinates(xWebView, yWebView) {
        // The dimensions are all relative to the WebView, so calculate absolute coordinates
        const element = (await this.getWebViewElement());
        const rect = await element.getRect();
        const absoluteX = xWebView + rect.x;
        const absoluteY = yWebView + rect.y;
        return { x: absoluteX, y: absoluteY };
    }
    /**
     * Bound the coordinates within the screen in NATIVE context and within the WebView in WEB
     * context.
     *
     * @return the original coordinate or the nearest coordinate within the bounds to the original
     */
    async boundCoordinates(location) {
        const { width, height } = (await this.isNative())
            ? await this.driver.browser.getWindowSize()
            : await this.getWebViewDocumentSize();
        return {
            x: this.getBoundedCoordinate(location.x, width),
            y: this.getBoundedCoordinate(location.y, height),
        };
    }
    /**
     * Bound the coordinate to avoid over scroll
     *
     *  @param coordinate the coordinate to bound
     *  @param dimension the dimension of the window
     * @return the bounded coordinate
     */
    getBoundedCoordinate(coordinate, dimension) {
        if (coordinate <= 0) {
            // beyond the lower bounds, adjust to 10% of dimension to avoid over scroll
            return Math.trunc(dimension * 0.1);
        }
        if (dimension <= coordinate) {
            // beyond the upper bounds, adjust to 90% of dimension to avoid over scroll
            return Math.trunc(dimension * 0.9);
        }
        return coordinate;
    }
    async isExisting() {
        // Search the element inside of the browser even if element is scoped inside different element
        const elements = await this.driver.browser.$$(this.element.selector);
        // according to https://github.com/webdriverio/webdriverio/issues/7307 WDIO does not throw if element not found
        return elements.length > 0;
    }
    getAttribute(attributeName) {
        // Override the implementation from the base class so as to call
        // the API directly.
        return this.element.getAttribute(attributeName);
    }
    isIOS() {
        return this.driver.browser.isIOS;
    }
}
exports.MobileElementWdioAdapter = MobileElementWdioAdapter;
//# sourceMappingURL=mobile-element-adapter.js.map