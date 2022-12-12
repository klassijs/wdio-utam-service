/// <reference types="webdriverio/async" />
import type { UtamLoader } from 'utam';
export { UtamWdioService as default } from './service';
export * from './service';
export * from './types';
declare global {
    var utam: UtamLoader<WebdriverIO.Element>;
}
//# sourceMappingURL=index.d.ts.map