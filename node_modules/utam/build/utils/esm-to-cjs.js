"use strict";
/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertEsmToCommonJs = void 0;
const rollup_1 = require("rollup");
function loadFromSource({ code }) {
    return {
        name: 'load-from-source',
        resolveId(id) {
            if (id === 'entry') {
                return id;
            }
            else {
                return { external: true, id };
            }
        },
        load(id) {
            if (id === 'entry') {
                return code;
            }
        },
    };
}
/**
 * convert generated code to common js
 * @param code generated code
 * @returns converted code
 */
async function convertEsmToCommonJs(code) {
    const bundle = await rollup_1.rollup({ input: 'entry', plugins: [loadFromSource({ code })] });
    const result = await bundle.generate({ format: 'commonjs', exports: 'auto' });
    const outputCode = result.output[0].code;
    return outputCode;
}
exports.convertEsmToCommonJs = convertEsmToCommonJs;
//# sourceMappingURL=esm-to-cjs.js.map