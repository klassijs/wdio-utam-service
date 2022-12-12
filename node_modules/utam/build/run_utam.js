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
exports.runUtam = void 0;
const fast_glob_1 = __importDefault(require("fast-glob"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const configs_1 = require("./utils/configs");
const constants_1 = require("./utils/constants");
const compiler_1 = require("@utam/compiler");
const esm_to_cjs_1 = require("./utils/esm-to-cjs");
const profiles_1 = require("./utils/profiles");
/**
 * Create an new object that holds all options necessary to process a given entry.
 * An entry is either a Page Object or a Utility. This function is used as a common
 * interface for the generation of Page Objects and Utilities. The returned object
 * holds all information necesssary to generates both entry type: Page Object & Utility.
 *
 * @param entry entry path relative to the current working directory
 * @param config UTAM project configuration
 * @returns an object that holds paths, extensions and flags necessary to process the entry
 */
function buildEntryOptions(entry, { pageObjectsRootDir, pageObjectsOutputDir, extensionsOutputDir, moduleTarget = 'commonjs', skipCommonJs, version, copyright, }) {
    const absPath = path_1.default.join(pageObjectsRootDir, entry.toString());
    const isEntryPageObject = entry.includes(constants_1.UTAM_EXT);
    const fileExt = isEntryPageObject ? constants_1.UTAM_EXT : constants_1.UTAM_EXTENSIONS_EXT;
    const outDir = isEntryPageObject ? pageObjectsOutputDir : extensionsOutputDir;
    const fileName = path_1.default.basename(absPath, fileExt);
    const isCjsTarget = moduleTarget === 'commonjs';
    const esmExt = isCjsTarget ? 'mjs' : 'js';
    const cjsExt = isCjsTarget ? 'js' : 'cjs';
    return {
        absPath,
        entry,
        rootDir: pageObjectsRootDir,
        outputDir: outDir,
        fileName,
        extensions: {
            esmExt,
            cjsExt,
        },
        skipCommonJs,
        version,
        copyright,
    };
}
/**
 * Compile and generate a Page Object and its type definition.
 *
 * @param entryOptions holds paths, extensions and flags necessary to compile POs and their types
 * @param alias optional pairs of type aliases
 */
async function compilePageObject(entryOptions, alias) {
    const { entry, absPath, rootDir, outputDir, fileName, extensions, skipCommonJs, version, copyright } = entryOptions;
    process.stdout.write(`Compiling ${entry}... `);
    const { esmExt, cjsExt } = extensions;
    const compiled = compiler_1.compileFromPath(absPath, { jsonPath: entry, version }, undefined, alias);
    const { code, typeDefinition, pageObject } = compiled;
    const outputFilePageObject = path_1.default.join(rootDir, outputDir, `${fileName}.${esmExt}`);
    const outputFileDefinition = path_1.default.join(rootDir, outputDir, `${fileName}.d.ts`);
    const copyrightHeader = `${compiler_1.textToJsDoc(copyright)}\n`;
    /**
     * TODO team discussion to see if we want to throw if the file exists (w+ flag)
     * in the destination directory This would require to either remove the generated
     * page objects from last run at the runner level or update the build scripts in consumer
     * repo to have a prebuild script that would remove the destination
     *
     * @see https://nodejs.org/dist/latest-v14.x/docs/api/fs.html#fs_file_system_flags
     */
    fs_1.default.writeFileSync(outputFilePageObject, copyrightHeader + code, 'utf8');
    fs_1.default.writeFileSync(outputFileDefinition, copyrightHeader + typeDefinition, 'utf8');
    if (!skipCommonJs) {
        const cjsCode = await esm_to_cjs_1.convertEsmToCommonJs(code);
        const outputFileCjsPageObject = path_1.default.join(rootDir, outputDir, `${fileName}.${cjsExt}`);
        fs_1.default.writeFileSync(outputFileCjsPageObject, copyrightHeader + cjsCode, 'utf8');
    }
    process.stdout.write(`[DONE]\n`);
    return pageObject;
}
/**
 * Copy and transpile a Utility.
 *
 * @param entryOptions holds paths, extensions and flags necessary to copy the utility
 */
async function copyUtility(entryOptions) {
    const { entry } = entryOptions;
    process.stdout.write(`Copying ${entry}... `);
    const { absPath, rootDir, outputDir, fileName, extensions, skipCommonJs } = entryOptions;
    const { esmExt, cjsExt } = extensions;
    const imperativeExtension = path_1.default.join(rootDir, outputDir, `${fileName}.${esmExt}`);
    /**
     * TODO team discussion to see if we want to throw if the file exists
     * in the destination directory (COPYFILE_EXCL flag). This would require
     * to either remove the generated utilities from last run at the runner level
     * or update the build scripts in consumer repo to have a prebuild script that
     * would remove the destination
     *
     * @see https://nodejs.org/dist/latest-v14.x/docs/api/fs.html#fs_fs_copyfilesync_src_dest_mode
     */
    fs_1.default.copyFileSync(absPath, imperativeExtension);
    if (!skipCommonJs) {
        const code = fs_1.default.readFileSync(absPath, 'utf8');
        const cjsCode = await esm_to_cjs_1.convertEsmToCommonJs(code);
        const outputFileCjsUtility = path_1.default.join(rootDir, outputDir, `${fileName}.${cjsExt}`);
        fs_1.default.writeFileSync(outputFileCjsUtility, cjsCode, 'utf8');
    }
    process.stdout.write(`[DONE]\n`);
}
function writeModuleProfiles(profileRenderer, config) {
    try {
        if (profileRenderer.hasProfiles() && !profileRenderer.hasMissingProfilesInProjectConfig) {
            const { module: utamModuleName } = config;
            const filename = `${utamModuleName}.config.json`;
            process.stdout.write(`Writing ${filename}... `);
            const { pageObjectsRootDir, pageObjectsOutputDir } = config;
            const outputDirRoot = path_1.default.join(pageObjectsOutputDir, '..');
            const outputProfilesConfig = path_1.default.join(pageObjectsRootDir, outputDirRoot, filename);
            const moduleProfiles = profileRenderer.render();
            fs_1.default.writeFileSync(outputProfilesConfig, moduleProfiles, 'utf8');
            process.stdout.write(`[DONE]\n`);
        }
    }
    catch (error) {
        process.stdout.write(`[FAILED]\n`);
        console.log(error);
        process.exitCode = 1;
    }
}
/**
 * Utility function used to memoize output dirs creation and create them once
 *
 * @param rootDir root directory from which output dir will be created
 * @returns a function that will create output dirs once
 */
function makeCreateOutputDirOnce(rootDir) {
    const isDirCreated = {
        pageObjects: false,
        utilities: false,
    };
    return function createOutputDirOnce({ target, outputDirPath }) {
        if (!isDirCreated[target]) {
            fs_1.default.mkdirSync(path_1.default.join(rootDir, outputDirPath), { recursive: true });
            isDirCreated[target] = true;
        }
    };
}
/**
 * Compile Page Objects and copy Utilities for a given project configuration.
 *
 * @param config UTAM project configuration.
 */
async function findAndProcessPOsAndUtils(config) {
    const { pageObjectsRootDir, pageObjectsFileMask, extensionsFileMask, pageObjectsOutputDir, extensionsOutputDir, alias, } = config;
    const createOutputDirOnce = makeCreateOutputDirOnce(pageObjectsRootDir);
    const pageObjectAndUtilsPathStream = fast_glob_1.default.stream([...pageObjectsFileMask, ...extensionsFileMask], {
        cwd: pageObjectsRootDir,
        ignore: ['**/node_modules/**'],
    });
    const profileRenderer = new profiles_1.ProfileRenderer();
    profileRenderer.loadProfileConfig(config);
    for await (const entry of pageObjectAndUtilsPathStream) {
        const entryAsStr = entry.toString();
        const isEntryPageObject = entryAsStr.includes(constants_1.UTAM_EXT);
        const entryOptions = buildEntryOptions(entryAsStr, config);
        try {
            if (isEntryPageObject) {
                createOutputDirOnce({ target: 'pageObjects', outputDirPath: pageObjectsOutputDir });
                const pageObject = await compilePageObject(entryOptions, alias);
                profileRenderer.setProfiles(pageObject, entryOptions);
            }
            else {
                createOutputDirOnce({ target: 'utilities', outputDirPath: extensionsOutputDir });
                await copyUtility(entryOptions);
            }
        }
        catch (error) {
            process.stdout.write(`[FAILED]\n`);
            console.log(error);
            process.exitCode = 1;
        }
    }
    writeModuleProfiles(profileRenderer, config);
}
/**
 * Generate Page Objects and Utilites from a collection of UTAM configurations.
 *
 * @param cliConfig UTAM CLI configuration passed as CLI arguments
 */
async function runUtam(cliConfig) {
    const configs = await configs_1.getConfigs(cliConfig);
    for (const config of configs) {
        await findAndProcessPOsAndUtils(config);
    }
}
exports.runUtam = runUtam;
//# sourceMappingURL=run_utam.js.map