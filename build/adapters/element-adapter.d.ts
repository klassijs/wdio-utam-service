/// <reference types="webdriverio/async" />
import { By, Driver, Element, ElementRectangle } from 'utam';
export declare class ElementWdioAdapter implements Element {
    instanceIdentity: string;
    element: WebdriverIO.Element;
    driver: Driver;
    constructor(element: WebdriverIO.Element, driver: Driver);
    /**
     * transforms wdio element into adapter. should override for other adapters
     * @param element wdio element
     * @returns new element object
     */
    protected __supplier__(element: WebdriverIO.Element): Element;
    findElement(locator: By): Promise<Element>;
    findElements(locator: By): Promise<Element[]>;
    getText(): Promise<string>;
    getCssValue(cssStyleProperty: string): Promise<string>;
    getAttribute(attributeName: string): Promise<string | null>;
    getRect(): Promise<ElementRectangle>;
    isDisplayed(): Promise<boolean>;
    isEnabled(): Promise<boolean>;
    isExisting(): Promise<boolean>;
    hasFocus(): Promise<boolean>;
    click(): Promise<void>;
    doubleClick(): Promise<void>;
    rightClick(): Promise<void>;
    clickAndHold(durationSec?: number): Promise<void>;
    clearValue(): Promise<void>;
    addValue(arg: string): Promise<void>;
    setValue(arg: string): Promise<void>;
    getValue(): Promise<string | null>;
    scrollIntoView(arg?: boolean | {
        block: ScrollLogicalPosition;
    }): Promise<void>;
    moveTo(options?: {
        xOffset: number;
        yOffset: number;
    }): Promise<void>;
    static classIdentity: string;
    static isWdioElement(element: unknown): element is ElementWdioAdapter;
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
    containsElement(locator: By): Promise<boolean>;
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
    containsElements(locator: By): Promise<number>;
    dragAndDrop(target: {
        element?: Element;
        offset?: {
            x: number;
            y: number;
        };
    }, durationSec?: number): Promise<void>;
    flick(offset: {
        x: number;
        y: number;
    }): Promise<void>;
    blur(): Promise<void>;
    focus(): Promise<void>;
}
//# sourceMappingURL=element-adapter.d.ts.map