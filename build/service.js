"use strict";
/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUtamLoader = exports.UtamWdioService = exports.mergeDriverConfig = void 0;
const utam_1 = require("utam");
const driver_adapter_1 = require("./adapters/driver-adapter");
const element_adapter_1 = require("./adapters/element-adapter");
const mobile_driver_adapter_1 = require("./adapters/mobile-driver-adapter");
const mobile_element_adapter_1 = require("./adapters/mobile-element-adapter");
const mobile_utils_1 = require("./utils/mobile-utils");
const DEFAULT_DRIVER_CONFIG = {
    implicitTimeout: 0,
    explicitTimeout: utam_1.DEFAULT_EXPLICIT_WAIT_TEIMEOUT,
    pollingInterval: utam_1.DEFAULT_POLLING_INTERVAL,
};
function mergeDriverConfig(wdioConfig = {}, utamConfig = {}) {
    return {
        ...DEFAULT_DRIVER_CONFIG,
        ...wdioConfig,
        ...utamConfig,
    };
}
exports.mergeDriverConfig = mergeDriverConfig;
class UtamWdioService {
    constructor(_utamConfig, _capabilities, _wdioConfig) {
        this._utamConfig = _utamConfig;
        this._capabilities = _capabilities;
        this._wdioConfig = _wdioConfig;
        // propagate wdio timeouts from wdio config + defaults
        const { injectionConfigs, ...utamDriverConfig } = _utamConfig;
        this.driverConfig = mergeDriverConfig({
            explicitTimeout: _wdioConfig.waitforTimeout,
            pollingInterval: _wdioConfig.waitforInterval,
            implicitTimeout: _wdioConfig.waitforTimeout,
        }, 
        // only pass the subset of properties relevant for the driver config from the utam service config
        utamDriverConfig);
        // store the injectionConfigs property so that we can pass it to the before hook
        this._injectionConfigs = injectionConfigs;
    }
    before(capabilities, specs, browser) {
        const { driverConfig, _injectionConfigs: injectionConfigs } = this;
        const utamLoader = createUtamLoader(browser, { driverConfig, injectionConfigs });
        global.utam = utamLoader;
    }
}
exports.UtamWdioService = UtamWdioService;
/**
 * build UtamLoader object from wdio BrowserObject
 * for consumers who need to instantiate browser without wdio config and service
 * @param browser browser object
 * @param config driver timeouts configuration plus utam service injectionConfigs paths
 */
function createUtamLoader(browser, config) {
    let driver, elementAdapter;
    const injectionConfigs = config?.injectionConfigs;
    if (browser.isMobile) {
        const mergedDriverConfig = mergeDriverConfig(config?.driverConfig);
        mergedDriverConfig.platformType = mobile_utils_1.getMobilePlatformType(browser);
        driver = new mobile_driver_adapter_1.MobileDriverWdioAdapter(browser, mergedDriverConfig);
        elementAdapter = (rawElement) => new mobile_element_adapter_1.MobileElementWdioAdapter(rawElement, driver);
    }
    else {
        driver = new driver_adapter_1.DriverWdioAdapter(browser, mergeDriverConfig(config?.driverConfig));
        elementAdapter = (rawElement) => new element_adapter_1.ElementWdioAdapter(rawElement, driver);
    }
    const loader = new utam_1.UtamLoader(driver, { elementAdapter, injectionConfigs });
    loader.setProfile('platform', mobile_utils_1.getMobilePlatformType(browser));
    return loader;
}
exports.createUtamLoader = createUtamLoader;
//# sourceMappingURL=service.js.map