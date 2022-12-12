"use strict";
/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUtam = void 0;
const generator_1 = require("@utam/generator");
const generator_configs_1 = require("./utils/generator-configs");
/**
 * Scan inputRootDir and generate UTAM JSON from each found HTML
 *
 * @param resolvedConfig generator and runner configs
 */
async function findAndProcess(resolvedConfig) {
    const { generatorOptions, runnerConfig } = resolvedConfig;
    // scan inputRootDir to find all HTML files
    const allAbsolutePaths = await generator_1.scan(runnerConfig);
    if (allAbsolutePaths.length === 0) {
        process.stdout.write('[UTAM Generator WARNING]: no input HTML files found...');
        return;
    }
    // if configured - create one output folder for all generated JSON files
    const commonOutputDir = generator_1.createSingleOutputDirectory(runnerConfig);
    const config = generator_1.resolveConfig(generatorOptions);
    for (const absolutePath of allAbsolutePaths) {
        try {
            // generate all possible JSON files from HTML source
            process.stdout.write(`Generating from ${absolutePath}...`);
            const generationOutput = generator_1.generateFromPath(absolutePath, config);
            if (generationOutput.length === 0) {
                process.stdout.write('[UTAM Generator WARNING]: HTML file is empty\n');
            }
            else {
                process.stdout.write(`[DONE]\n`);
            }
            // write all generated files
            for (const output of generationOutput) {
                generator_1.writeOutputJSON(output, absolutePath, runnerConfig, commonOutputDir);
            }
        }
        catch (error) {
            process.stdout.write(`[UTAM Generator FAILED]\n`);
            console.log(error);
            process.exitCode = 1;
        }
    }
}
/**
 * Generate JSON Page Objects from a UTAM generator configuration.
 *
 * @param cliConfig UTAM CLI configuration passed as CLI arguments
 */
async function generateUtam(cliConfig) {
    const configs = generator_configs_1.getGeneratorConfigs(cliConfig);
    for (const config of configs) {
        await findAndProcess(config);
    }
}
exports.generateUtam = generateUtam;
//# sourceMappingURL=run_generator.js.map