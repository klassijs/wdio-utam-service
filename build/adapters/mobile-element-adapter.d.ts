/// <reference types="webdriverio/async" />
import { Element } from 'utam';
import { ElementWdioAdapter } from './element-adapter';
interface Point {
    x: number;
    y: number;
}
export declare class MobileElementWdioAdapter extends ElementWdioAdapter implements Element {
    /**
     * transforms wdio element into adapter, overrides its parent's supplier
     * @param element wdio element
     * @returns new element object
     */
    protected __supplier__(element: WebdriverIO.Element): Element;
    flick(offset: {
        x: number;
        y: number;
    }): Promise<void>;
    /**
     * From the original touch action press and move to points to get the actually press and move to points
     *
     * @param originalStartPoint the original touch action press point
     * @param originalEndPoint the original touch action move to point
     * @return flickStartPoint, flickEndPoint the actually touch action press and move to points
     */
    getFlickCoordinates(originalStartPoint: Point, originalEndPoint: Point): Promise<{
        flickStartPoint: Point;
        flickEndPoint: Point;
    }>;
    /**
     * Check current context is native or not
     *
     * @return boolean, true if current context is native, otherwise is false
     */
    isNative(): Promise<boolean>;
    /**
     * Convert a coordinates in WEB conext to a coordinates in NATIVE context
     *
     * @param location the coordinates in WEB context
     * @return the coordinates in NATIVE context
     */
    convertWebViewLocationToNativeCoordinates(location: Point): Promise<Point>;
    /**
     * Gets the dimension of window or document
     *
     * @return Dimension of window or document
     */
    getWebViewDocumentSize(): Promise<{
        width: number;
        height: number;
    }>;
    /**
     * Gets the coordinate offsets caused by window offset
     *
     * @return offset coordinates
     */
    getScrollOffset(): Promise<{
        x: number;
        y: number;
    }>;
    /**
     * Gets the WebView element
     *
     * @return the instance of WebView element
     */
    getWebViewElement(): Promise<Element>;
    /**
     * Convert coordinates in web view to coordinates in native
     * @param coordinate the coordiantion in WEB context
     * @param scrollOffset the offset coordinate of touch action
     * @param elementSize the size of element
     * @param docDimension the size of document
     * @return the converted coordinates in navtive context
     */
    webViewToNative(value: {
        coordinate: number;
        scrollOffset: number;
        elementSize: number;
        docDimension: number;
    }): number;
    /**
     * Calculate the absolute coordinates of the given coordinates.
     *
     * @param xWebView The x coordinate relative to the WebView
     * @param yWebView The y coordinate relative to the WebView
     * @return The absolute position of the target
     */
    getAbsoluteCoordinates(xWebView: number, yWebView: number): Promise<Point>;
    /**
     * Bound the coordinates within the screen in NATIVE context and within the WebView in WEB
     * context.
     *
     * @return the original coordinate or the nearest coordinate within the bounds to the original
     */
    boundCoordinates(location: Point): Promise<Point>;
    /**
     * Bound the coordinate to avoid over scroll
     *
     *  @param coordinate the coordinate to bound
     *  @param dimension the dimension of the window
     * @return the bounded coordinate
     */
    getBoundedCoordinate(coordinate: number, dimension: number): number;
    isExisting(): Promise<boolean>;
    getAttribute(attributeName: string): Promise<string>;
    isIOS(): boolean;
}
export {};
//# sourceMappingURL=mobile-element-adapter.d.ts.map