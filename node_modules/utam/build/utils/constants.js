"use strict";
/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_GENERATOR_RUNNER_CONFIG = exports.DEFAULT_CONFIG = exports.UTAM_EXTENSIONS_EXT = exports.UTAM_EXT = exports.UTAM_CONFIG = exports.PACKAGE_JSON = void 0;
const generator_1 = require("@utam/generator");
exports.PACKAGE_JSON = 'package.json';
exports.UTAM_CONFIG = 'utam.config.js';
exports.UTAM_EXT = '.utam.json';
exports.UTAM_EXTENSIONS_EXT = '.utam.js';
exports.DEFAULT_CONFIG = {
    pageObjectsFileMask: ['**/__utam__/**/*.utam.json'],
    extensionsFileMask: ['**/__utam__/**/*.utam.js'],
    pageObjectsOutputDir: 'pageObjects',
    extensionsOutputDir: 'utils',
};
/**
 * Default generator runner config
 */
exports.DEFAULT_GENERATOR_RUNNER_CONFIG = {
    inputRootDir: './',
    ignore: ['**/node_modules/**'],
    inputFileMask: generator_1.DEFAULT_INPUT_FILE_MASKS,
    outputDir: '__utam__',
    outputFileExtension: '.utam.json',
    relativeOutputDir: false,
    overrideExisting: true,
};
//# sourceMappingURL=constants.js.map