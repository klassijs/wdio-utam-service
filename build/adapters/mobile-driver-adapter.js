"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobileDriverWdioAdapter = void 0;
const driver_adapter_1 = require("./driver-adapter");
const mobile_element_adapter_1 = require("./mobile-element-adapter");
/**
 * Typeguard to distinguish between basic and full contexts
 * @param ctx current context
 * @returns true if it's a detailed context, false otherwise
 */
function isDetailedContext(ctx) {
    return typeof ctx !== 'string' && 'id' in ctx;
}
/**
 * Utility function that abstract away the 2 different contexts (basic & full)
 * @see https://github.com/webdriverio/webdriverio/issues/8540
 * @param ctx current context
 * @returns the value of the context
 */
function getContextValue(ctx) {
    return !isDetailedContext(ctx) ? ctx : ctx.id;
}
class MobileDriverWdioAdapter extends driver_adapter_1.DriverWdioAdapter {
    constructor() {
        super(...arguments);
        this.nativeContext = 'NATIVE_APP';
    }
    /**
     * transforms wdio element into adapter, overrides its parent's supplier
     * @param element wdio element
     * @returns new element object
     */
    __supplier__(element) {
        return new mobile_element_adapter_1.MobileElementWdioAdapter(element, this);
    }
    async setPageContextToNative() {
        // do nothing, if current page context is native
        if (!(await this.isNativeContext())) {
            await this.browser.switchContext(this.nativeContext);
        }
    }
    async setPageContextToWebView(title) {
        if (!title) {
            throw new Error('Bridge application title is null, please configure');
        }
        // Test application will take some time to create a new webview page during navigation
        // This for loop is to poll and wait for new webview page(s) to show for 10s
        // Since there is no way to check with application if the new page has been created or not
        for (let i = 1; i <= 20; i++) {
            if (this.browser.isAndroid) {
                // Set current context to native to get the updated available contexts
                // Otherwise, the closed webview that is the current context will not be dropped
                // from the return of getContextHandles. This is Android unique.
                await this.setPageContextToNative();
            }
            const availableContexts = await this.waitForWebViewContextAvailable();
            for (const context of availableContexts) {
                if (context !== this.nativeContext) {
                    await this.browser.switchContext(context);
                    const newTitle = await this.browser.getTitle();
                    if (newTitle === title) {
                        return;
                    }
                }
            }
            await new Promise((resolve) => setTimeout(resolve, 500));
        }
        // For the Appium chromedriver limitation to handle multiple WebViews,
        // If switch to context fail to find the target WebView, then switch to
        // use window
        if (this.browser.isAndroid) {
            const availableHandles = await this.browser.getWindowHandles();
            for (const handle of availableHandles) {
                if (handle !== this.nativeContext) {
                    await this.browser.switchToWindow(handle);
                    const newTitle = await this.browser.getTitle();
                    if (newTitle === title) {
                        return;
                    }
                }
            }
        }
        throw new Error(`Failed to switch to target WebView with title: ${title}.`);
    }
    async isNativeContext() {
        return (await this.getPageContext()) === this.nativeContext;
    }
    async getPageContext() {
        const browserContext = await this.browser.getContext();
        return getContextValue(browserContext);
    }
    async setPageContext(contextType, bridgeAppTitle = this.config.bridgeAppTitle) {
        if (contextType === 'web') {
            await this.setPageContextToWebView(bridgeAppTitle);
        }
        else {
            await this.setPageContextToNative();
        }
    }
    async waitForWebViewContextAvailable() {
        await this.waitFor(async () => {
            return await this.isWebViewAvailable();
        });
        const availableContexts = await this.browser.getContexts();
        return availableContexts.map(getContextValue);
    }
    async isWebViewAvailable() {
        const availableContexts = await this.browser.getContexts();
        return availableContexts.map(getContextValue).some((context) => context.includes('WEBVIEW'));
    }
}
exports.MobileDriverWdioAdapter = MobileDriverWdioAdapter;
//# sourceMappingURL=mobile-driver-adapter.js.map