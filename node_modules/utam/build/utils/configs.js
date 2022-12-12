"use strict";
/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfigs = void 0;
const config_validations_1 = require("./config-validations");
const core_1 = require("@utam/core");
const constants_1 = require("./constants");
const resolve_config_1 = require("./resolve-config");
function validateTarget(target) {
    if (target !== undefined && target !== 'commonjs' && target !== 'module') {
        throw new Error('Invalid module target: Value must be of type: "commonjs | module" ');
    }
    return target;
}
/**
 * @todo don't throw but leverage some Either ADT
 * @param module
 * @returns
 */
function validateModule(module) {
    if (!config_validations_1.isString(module)) {
        // TODO be more specific, it also throws when the value isn't present
        throw new Error('Invalid module value type: Value must a be "string"');
    }
    return module;
}
/**
 * @todo don't throw but leverage some Either ADT
 * @param profiles
 * @returns
 */
function validateProfile(profiles) {
    if (!config_validations_1.isProfile(profiles) || config_validations_1.hasDuplicatedKeys(profiles)) {
        // TODO be more specific about the error
        throw new Error('Invalid profiles configuration in compiler config');
    }
    return profiles;
}
/**
 * Parse the provided compiler configuration
 *
 * @todo set the argument type to a narrower type as it comes from runtime
 * @todo add more validations
 * @param projectConfig
 * @returns
 */
function validateConfig(projectConfig) {
    // NOTE: this is a shortcut that should be removed once we parse the whole config file
    // for now we only parse with fast-fail error handling the profile and module section
    if (!projectConfig.profiles) {
        return projectConfig;
    }
    // Ensure that module is present if we have profiles defined
    const module = validateModule(projectConfig.module);
    const profiles = validateProfile(projectConfig.profiles);
    return {
        ...projectConfig,
        module,
        profiles,
    };
}
/**
 * Normalize the UTAM compiler configuration object by adding the default profile to it's profiles config.
 * If there are no profiles configured in the compiler config, we set it to the default profile
 * If there are some profiles configured in the compiler config, we append the default profile to the profile list
 *
 * @param projectConfig compiler configuration object as loaded from the file system
 * @returns the updated config file with default profiles appened
 */
function normalizeProfiles(projectConfig) {
    const { profiles = [] } = projectConfig;
    const defaultProfile = {
        name: core_1.DEFAULT_PROFILE_NAME,
        values: [core_1.DEFAULT_PROFILE_VALUE],
    };
    return [...profiles, defaultProfile];
}
function normalizeProjectConfig(projectConfig, cliConfig) {
    const moduleTarget = validateTarget(cliConfig.target);
    const normalizedProfiles = { profiles: normalizeProfiles(projectConfig) };
    return {
        moduleTarget,
        ...constants_1.DEFAULT_CONFIG,
        ...projectConfig,
        ...normalizedProfiles,
    };
}
async function readConfig(cliConfig, packageRoot) {
    const configPath = resolve_config_1.resolveConfigPath(packageRoot, process.cwd());
    const rawProjectConfig = resolve_config_1.readConfigAndSetRootDir(configPath);
    const validatedProjectConfig = validateConfig(rawProjectConfig);
    const projectConfig = normalizeProjectConfig(validatedProjectConfig, cliConfig);
    return { configPath, projectConfig };
}
async function getConfigs(cliConfig) {
    const { projects } = cliConfig;
    if (projects.length === 1) {
        const { projectConfig } = await readConfig(cliConfig, cliConfig.configPath || projects[0]);
        return [projectConfig];
    }
    else {
        const parsedConfigs = await Promise.all(projects.map((root) => readConfig(cliConfig, root)));
        resolve_config_1.ensureNoDuplicateConfigs(parsedConfigs, projects);
        const projectsConfigs = parsedConfigs.map(({ projectConfig }) => projectConfig);
        return projectsConfigs;
    }
}
exports.getConfigs = getConfigs;
//# sourceMappingURL=configs.js.map