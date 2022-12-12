import type { DriverConfig } from 'utam';
export interface UtamWdioServiceConfig {
    /**
     * implicit timeout can't be set in wdio static config
     * but can be set as parameter to utam service, ex:
     * services: ['chromedriver', [UtamWdioService, { implicitTimeout:  10000 }]]
     */
    implicitTimeout: number;
    /**
     * bridge app title for mobile automation
     * can be set as parameter to utam service, ex:
     * services: ['chromedriver', [UtamWdioService, { bridgeAppTitle:  'MyApp' }]]
     */
    bridgeAppTitle: string;
    /**
     * dependency injections configurations file paths
     * can be set as a parameter to utam service, ex:
     * services: ['chromedriver', [UtamWdioService, {
     *     injectionConfigs: [path.join(__dirname, './injection.config.json'),
     *     'my-package/path/to/injection.config.json']
     * }]]
     */
    injectionConfigs?: string[];
}
/**
 * Represent the configuration that is passed to createUtamLoader factory
 */
export interface LoaderFactoryConfig {
    /**
     * driver timeouts config
     */
    driverConfig: Partial<DriverConfig>;
    /**
     * list of dependency injections configuration files paths if defined
     */
    injectionConfigs: UtamWdioServiceConfig['injectionConfigs'];
}
//# sourceMappingURL=types.d.ts.map