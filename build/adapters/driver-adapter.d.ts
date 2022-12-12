/// <reference types="webdriverio/async" />
import { Element, SerializableOrElement, WaitForOptions } from '@utam/core';
import { Driver, DriverConfig, Locator, MobileContextType } from 'utam';
export declare class DriverWdioAdapter implements Driver {
    config: DriverConfig;
    browser: WebdriverIO.Browser;
    constructor(browser: WebdriverIO.Browser, config: DriverConfig);
    /**
     * transforms wdio element into adapter. should override for other adapters
     * @param element wdio element
     * @returns new element object
     */
    protected __supplier__(element: WebdriverIO.Element): Element;
    executeScript<T>(script: string | ((...args: unknown[]) => T), ...args: unknown[]): Promise<T>;
    findElement(locator: Locator): Promise<Element>;
    findElements(locator: Locator): Promise<Element[]>;
    waitFor<T>(condition: Promise<T> | ((...args: SerializableOrElement[]) => T | Promise<T>), options?: WaitForOptions, ...args: SerializableOrElement[]): Promise<T>;
    enterFrame(element: Element): Promise<void>;
    exitToParentFrame(): Promise<void>;
    exitFrame(): Promise<void>;
    /**
     * Navigate backward in the current browsing context
     * @see https://www.w3.org/TR/webdriver2/#back
     * @see https://webdriver.io/docs/api/webdriver/#back
     */
    back(): Promise<void>;
    /**
     * Navigate forward in the current browsing context
     * @see https://www.w3.org/TR/webdriver2/#forward
     * @see https://webdriver.io/docs/api/webdriver/#forward
     */
    forward(): Promise<void>;
    press(key: string, options?: {
        text?: string;
    }): Promise<void>;
    setPageContextToNative(): Promise<void>;
    setPageContextToWebView(title: string): Promise<void>;
    isNativeContext(): Promise<boolean>;
    getPageContext(): Promise<string | null>;
    setPageContext(contextType: MobileContextType): Promise<void>;
}
//# sourceMappingURL=driver-adapter.d.ts.map