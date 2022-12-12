import type { UtamCliConfig } from './cli';
declare type esmExt = 'js' | 'mjs';
declare type cjsExt = 'js' | 'cjs';
interface ModuleExtensions {
    /** ES Module file extension */
    esmExt: esmExt;
    /** CommonJS file extension */
    cjsExt: cjsExt;
}
export interface EntryOptions {
    /**  entry absolute path */
    absPath: string;
    /** entry path relative to the current working directory */
    entry: string;
    /** directory in which the utam compiler search for POs & Extensions */
    rootDir: string;
    /** directory in which POs and Extensions are generated into */
    outputDir: string;
    /** entry filename (without extension) */
    fileName: string;
    /** extensions for supported modules formats */
    extensions: ModuleExtensions;
    /** toggle commonJS module generation on and off */
    skipCommonJs: boolean | undefined;
    /** current version of page objects, usually matches application version */
    version: string;
    /** page object copyright to add to generated file */
    copyright?: string[];
}
/**
 * Generate Page Objects and Utilites from a collection of UTAM configurations.
 *
 * @param cliConfig UTAM CLI configuration passed as CLI arguments
 */
export declare function runUtam(cliConfig: UtamCliConfig): Promise<void>;
export {};
//# sourceMappingURL=run_utam.d.ts.map