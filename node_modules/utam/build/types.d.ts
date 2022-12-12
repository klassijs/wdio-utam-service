/** Represent the compiler configuration for profiles */
export interface UtamProfilesConfig {
    /** Name of the profile */
    name: string;
    /** Allowed values for that profile */
    values: string[];
}
export interface UtamProjectConfig {
    /**
     * Root directory from which the compiler will search for Page Objects & Extensions
     */
    pageObjectsRootDir: string;
    /**
     * Glob patterns that match JSON Page Objects
     */
    pageObjectsFileMask: string[];
    /**
     * Glob patterns that match Page Objects Extensions
     */
    extensionsFileMask: string[];
    /**
     * Destination directory for generated Page Objects and Type Definitions
     * */
    pageObjectsOutputDir: string;
    /**
     * Destination directory for Page Objects Extensions
     */
    extensionsOutputDir: string;
    /**
     * List projects where the compiler must be run (not implemented at the moment)
     */
    projects?: string[];
    /**
     * Default module system used for Page Objects & Utilities modules (.js file extension)
     */
    moduleTarget?: 'module' | 'commonjs';
    /**
     * Toggle generation of Page Objects & Utilities as CJS modules on and off
     */
    skipCommonJs?: boolean;
    /**
     * Path to the type alias config file (string) or inline type alias configuration (Record)
     */
    alias?: string | Record<string, string>;
    /**
     * List profiles supported by the compiler
     */
    profiles: UtamProfilesConfig[];
    /**
     * Name of the current module
     */
    module?: string;
    /**
     * page objects version to add to jsDoc
     */
    version: string;
    /**
     * page object copyright to add to generated file
     */
    copyright?: string[];
}
/**
 * Represent the project config file once the type alias config file has been resolved
 */
export interface ResolvedUtamProjectConfig extends UtamProjectConfig {
    /**
     * alias definition as declared inline or in the type alias configuration file
     */
    alias?: Record<string, string>;
}
//# sourceMappingURL=types.d.ts.map