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
exports.runGenerate = exports.run = exports.buildArgs = void 0;
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const run_utam_1 = require("../run_utam");
const run_generator_1 = require("../run_generator");
const args_1 = require("./args");
function normalizeArgs(argx) {
    return {
        configPath: argx.config || '',
        projects: argx.projects ?? [process.cwd()],
        target: argx.target,
    };
}
function buildArgs(maybeArgv) {
    const parsedArgs = yargs_1.default(maybeArgv || helpers_1.hideBin(process.argv))
        .usage(args_1.usage)
        .options(args_1.options)
        .example(args_1.examples)
        .describe(args_1.descriptions)
        .alias(args_1.aliases)
        .epilogue(args_1.docs)
        .parseSync();
    return parsedArgs;
}
exports.buildArgs = buildArgs;
async function run(maybeArgv) {
    const rawArgsCli = buildArgs(maybeArgv);
    const utamCliConfig = normalizeArgs(rawArgsCli);
    run_utam_1.runUtam(utamCliConfig);
}
exports.run = run;
/**
 * Run JSON generator. Invoked from CLI or utam/bin/utam-generate.js and can have CLI parameters
 * @param maybeArgv CLI parameters
 */
async function runGenerate(maybeArgv) {
    const rawArgsCli = buildArgs(maybeArgv);
    const utamCliConfig = normalizeArgs(rawArgsCli);
    run_generator_1.generateUtam(utamCliConfig);
}
exports.runGenerate = runGenerate;
//# sourceMappingURL=index.js.map