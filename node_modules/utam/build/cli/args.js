"use strict";
/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.aliases = exports.descriptions = exports.examples = exports.options = exports.docs = exports.usage = void 0;
exports.usage = 'Usage: $0 [OPTIONS]';
exports.docs = 'Visit https://utam.dev to learn more about UTAM.';
// options<O extends { [key: string]: Options }>(options: O): Argv<Omit<T, keyof O> & InferredOptionTypes<O>>;
exports.options = {
    config: {
        alias: 'c',
        type: 'string',
        describe: 'Set configuration file',
    },
    projects: {
        alias: 'p',
        type: 'array',
        describe: 'Compile multiple projects',
    },
    target: {
        alias: 't',
        describe: 'Set page objects \ndefault module system',
        choices: ['commonjs', 'module'],
    },
};
exports.examples = [
    ['$0 -c "path/to/utam.config.json"', 'Use specific compiler config file'],
    ['$0 -t "module"', 'Emit JS Page Objects as ES Modules'],
    ['$0 -p project1/utam.config.json project2/utam.config.json', 'Compile multiple projects'],
];
exports.descriptions = {
    version: 'Print compiler version info',
    help: 'Display this message',
};
exports.aliases = {
    help: 'h',
    version: 'v',
};
//# sourceMappingURL=args.js.map