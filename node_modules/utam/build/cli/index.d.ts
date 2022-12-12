interface CliArgs {
    [x: string]: unknown;
    config: unknown;
    projects: unknown;
    target?: unknown;
    _: (string | number)[];
}
export interface UtamCliConfig {
    configPath: string;
    projects: string[];
    target?: string;
}
export declare function buildArgs(maybeArgv?: string[]): CliArgs;
export declare function run(maybeArgv?: string[]): Promise<void>;
/**
 * Run JSON generator. Invoked from CLI or utam/bin/utam-generate.js and can have CLI parameters
 * @param maybeArgv CLI parameters
 */
export declare function runGenerate(maybeArgv?: string[]): Promise<void>;
export {};
//# sourceMappingURL=index.d.ts.map