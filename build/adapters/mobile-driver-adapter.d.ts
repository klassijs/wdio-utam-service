/// <reference types="webdriverio/async" />
import { Driver, Element, MobileContextType } from 'utam';
import { DriverWdioAdapter } from './driver-adapter';
export declare class MobileDriverWdioAdapter extends DriverWdioAdapter implements Driver {
    readonly nativeContext = "NATIVE_APP";
    /**
     * transforms wdio element into adapter, overrides its parent's supplier
     * @param element wdio element
     * @returns new element object
     */
    protected __supplier__(element: WebdriverIO.Element): Element;
    setPageContextToNative(): Promise<void>;
    setPageContextToWebView(title?: string): Promise<void>;
    isNativeContext(): Promise<boolean>;
    getPageContext(): Promise<string | null>;
    setPageContext(contextType: MobileContextType, bridgeAppTitle?: string | undefined): Promise<void>;
    waitForWebViewContextAvailable(): Promise<string[]>;
    isWebViewAvailable(): Promise<boolean>;
}
//# sourceMappingURL=mobile-driver-adapter.d.ts.map