"use strict";
/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGeneratorConfigs = void 0;
const resolve_config_1 = require("./resolve-config");
const constants_1 = require("./constants");
function validateGeneratorConfig(configPath, config) {
    const { outputDir, relativeOutputDir } = config;
    if (!outputDir && !relativeOutputDir) {
        throw new Error(`Error in UTAM generator config ${configPath}:\n one of "outputDir" or "relativeOutputDir" should be set!`);
    }
}
/**
 * read generator config and merge with default options
 * @param packageRoot resolve config path
 * @returns generator configuration
 */
function readGeneratorConfig(packageRoot) {
    const configPath = resolve_config_1.resolveConfigPath(packageRoot, process.cwd());
    const rawProjectConfig = readGeneratorConfigAndSetRootDir(configPath);
    const runnerConfig = {
        ...constants_1.DEFAULT_GENERATOR_RUNNER_CONFIG,
        ...rawProjectConfig,
    };
    validateGeneratorConfig(configPath, runnerConfig);
    const generatorOptions = {
        ...rawProjectConfig,
    };
    return {
        runnerConfig,
        generatorOptions,
        configPath,
    };
}
/**
 * From CLI args build one or multiple generator configurations
 * @param cliConfig CLI args
 * @returns generator configurations array
 */
function getGeneratorConfigs(cliConfig) {
    const { projects } = cliConfig;
    if (projects.length === 1) {
        const projectConfig = readGeneratorConfig(cliConfig.configPath || projects[0]);
        return [projectConfig];
    }
    else {
        const parsedConfigs = projects.map((root) => readGeneratorConfig(root));
        resolve_config_1.ensureNoDuplicateConfigs(parsedConfigs, projects);
        return parsedConfigs;
    }
}
exports.getGeneratorConfigs = getGeneratorConfigs;
/**
 * read config if it exists, otherwise return input root dir and later merge with default config
 * @param configPath path to the config
 * @returns partial config as set in the provided path
 */
function readGeneratorConfigAndSetRootDir(configPath) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const configObject = require(configPath);
        configObject.inputRootDir = resolve_config_1.resolveRootPath(configPath, configObject.inputRootDir);
        return configObject;
    }
    catch (error) {
        throw new Error(`Utam: Failed to parse config file ${configPath}:\n${error.message}`);
    }
}
//# sourceMappingURL=generator-configs.js.map