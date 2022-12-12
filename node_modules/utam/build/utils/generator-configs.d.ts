import { UtamCliConfig } from '../cli';
import { GeneratorRunnerConfig, GeneratorConfigOptions } from '@utam/types';
/**
 * helper interface to carry both configs and path to config file
 */
export interface ResolvedGeneratorConfig {
    runnerConfig: GeneratorRunnerConfig;
    generatorOptions: Partial<GeneratorConfigOptions>;
    configPath: string;
}
/**
 * From CLI args build one or multiple generator configurations
 * @param cliConfig CLI args
 * @returns generator configurations array
 */
export declare function getGeneratorConfigs(cliConfig: UtamCliConfig): ResolvedGeneratorConfig[];
//# sourceMappingURL=generator-configs.d.ts.map