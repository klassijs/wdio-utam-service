import type { Argv, Options } from 'yargs';
export declare const usage = "Usage: $0 [OPTIONS]";
export declare const docs = "Visit https://utam.dev to learn more about UTAM.";
interface ArgsConfig {
    [key: string]: Options;
    config: Options;
    projects: Options;
}
declare type ArgvExamples = Parameters<Argv['example']>[0];
declare type OptionDescriptions = Parameters<Argv['describe']>[0];
export declare const options: ArgsConfig;
export declare const examples: ArgvExamples;
export declare const descriptions: OptionDescriptions;
export declare const aliases: {
    help: string;
    version: string;
};
export {};
//# sourceMappingURL=args.d.ts.map