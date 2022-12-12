/// <reference types="webdriverio/async" />
import { By } from '@utam/core';
interface ElementContext {
    selector?: string;
}
export declare function isReifiableElement(elements: any): boolean;
export declare function reify(browser: WebdriverIO.Browser, rawElements: any, context?: ElementContext): Promise<WebdriverIO.Element | WebdriverIO.Element[]>;
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
export declare function buildWdioSelector(locator: By): string;
export {};
//# sourceMappingURL=wdio-utils.d.ts.map