/// <reference types="webdriverio/async" />
import type { Capabilities, Options, Services } from '@wdio/types';
import { DriverConfig, UtamLoader } from 'utam';
import { LoaderFactoryConfig, UtamWdioServiceConfig } from './types';
export declare function mergeDriverConfig(wdioConfig?: Partial<DriverConfig>, utamConfig?: Partial<Omit<UtamWdioServiceConfig, 'injectionConfigs'>>): DriverConfig;
export declare class UtamWdioService implements Services.ServiceInstance {
    readonly _utamConfig: UtamWdioServiceConfig;
    readonly _capabilities: Capabilities.RemoteCapability;
    readonly _wdioConfig: Omit<Options.Testrunner, 'capabilities'>;
    driverConfig: DriverConfig;
    private readonly _injectionConfigs;
    constructor(_utamConfig: UtamWdioServiceConfig, _capabilities: Capabilities.RemoteCapability, _wdioConfig: Omit<Options.Testrunner, 'capabilities'>);
    before(capabilities: Capabilities.RemoteCapability, specs: string[], browser: any): void;
}
/**
 * build UtamLoader object from wdio BrowserObject
 * for consumers who need to instantiate browser without wdio config and service
 * @param browser browser object
 * @param config driver timeouts configuration plus utam service injectionConfigs paths
 */
export declare function createUtamLoader(browser: any, config?: LoaderFactoryConfig): UtamLoader<WebdriverIO.Element>;
//# sourceMappingURL=service.d.ts.map