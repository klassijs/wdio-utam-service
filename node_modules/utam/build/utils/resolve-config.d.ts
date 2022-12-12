import { ResolvedUtamProjectConfig } from '../types';
export declare function resolveConfigPath(pathToResolve: string, cwd: string): string;
/**
 * resolve root path depending on current path and config
 * @param configPath config path
 * @param rootDir path set in config
 * @returns string with path
 */
export declare function resolveRootPath(configPath: string, rootDir?: string): string;
export declare function readConfigAndSetRootDir(configPath: string): ResolvedUtamProjectConfig;
export declare function ensureNoDuplicateConfigs(parsedConfigs: any, projects: string[]): void;
//# sourceMappingURL=resolve-config.d.ts.map