"use strict";
/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureNoDuplicateConfigs = exports.readConfigAndSetRootDir = exports.resolveRootPath = exports.resolveConfigPath = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const constants_1 = require("./constants");
function isFile(filePath) {
    return fs_1.default.existsSync(filePath) && !fs_1.default.lstatSync(filePath).isDirectory();
}
function resolveConfigPathByTraversing(pathToResolve, initialPath, cwd) {
    const utamConfig = path_1.default.resolve(pathToResolve, constants_1.UTAM_CONFIG);
    if (isFile(utamConfig)) {
        return utamConfig;
    }
    const packageJson = path_1.default.resolve(pathToResolve, constants_1.PACKAGE_JSON);
    if (isFile(packageJson)) {
        return packageJson;
    }
    if (pathToResolve === path_1.default.dirname(pathToResolve)) {
        throw new Error(`No config found in ${initialPath}`);
    }
    // go up a level and try it again
    return resolveConfigPathByTraversing(path_1.default.dirname(pathToResolve), initialPath, cwd);
}
function resolveConfigPath(pathToResolve, cwd) {
    const absolutePath = path_1.default.isAbsolute(pathToResolve) ? pathToResolve : path_1.default.resolve(cwd, pathToResolve);
    if (isFile(absolutePath)) {
        return absolutePath;
    }
    return resolveConfigPathByTraversing(absolutePath, pathToResolve, cwd);
}
exports.resolveConfigPath = resolveConfigPath;
function readAliasConfig(aliasConfigPath) {
    const isJSON = aliasConfigPath.endsWith('.json');
    if (!isJSON) {
        throw new Error(`Utam: type alias must be declared in a JSON file`);
    }
    try {
        return require(aliasConfigPath);
    }
    catch (error) {
        if (isJSON) {
            throw new Error(`Utam: Failed to parse alias config file ${aliasConfigPath}\n`);
        }
        else {
            throw error;
        }
    }
}
/**
 * resolve root path depending on current path and config
 * @param configPath config path
 * @param rootDir path set in config
 * @returns string with path
 */
function resolveRootPath(configPath, rootDir) {
    if (rootDir) {
        // return as is if it has an absolute path specified
        // otherwise, we'll resolve it relative to the file's __dirname
        return path_1.default.isAbsolute(rootDir) ? rootDir : path_1.default.resolve(path_1.default.dirname(configPath), rootDir);
    }
    else {
        // If pageObjectsRootDir is not there, we'll set it to this file's __dirname
        return path_1.default.dirname(configPath);
    }
}
exports.resolveRootPath = resolveRootPath;
// TODO set a broader return type (any || unknown) as we didn't parse the config file yet
function readConfigAndSetRootDir(configPath) {
    const isJSON = configPath.endsWith('.json');
    let configObject;
    try {
        configObject = require(configPath);
    }
    catch (error) {
        if (isJSON) {
            throw new Error(`Utam: Failed to parse config file ${configPath}\n`);
        }
        else {
            throw error;
        }
    }
    if (configPath.endsWith(constants_1.PACKAGE_JSON)) {
        if (!configObject.utam) {
            throw new Error(`No "utam" section has been found in ${configPath}`);
        }
        configObject = configObject.utam;
    }
    if (!configObject) {
        throw new Error("Couldn't find any configuration for Utam");
    }
    configObject.pageObjectsRootDir = resolveRootPath(configPath, configObject.pageObjectsRootDir);
    if (configObject.alias && typeof configObject.alias === 'string') {
        // Read the alias config relatively from the utam configuration file
        configObject.alias = readAliasConfig(path_1.default.resolve(path_1.default.dirname(configPath), configObject.alias));
    }
    return configObject;
}
exports.readConfigAndSetRootDir = readConfigAndSetRootDir;
function ensureNoDuplicateConfigs(parsedConfigs, projects) {
    const configPathSet = new Set();
    for (const { configPath } of parsedConfigs) {
        if (configPathSet.has(configPath)) {
            let message = 'One or more specified projects share the same config file\n';
            parsedConfigs.forEach((projectConfig, index) => {
                message =
                    message +
                        '\nProject: "' +
                        projects[index] +
                        '"\nConfig: "' +
                        String(projectConfig.configPath) +
                        '"';
            });
            throw new Error(message);
        }
        if (configPath !== null) {
            configPathSet.add(configPath);
        }
    }
}
exports.ensureNoDuplicateConfigs = ensureNoDuplicateConfigs;
//# sourceMappingURL=resolve-config.js.map