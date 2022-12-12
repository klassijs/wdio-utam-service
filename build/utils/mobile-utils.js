"use strict";
/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMobilePlatformType = void 0;
/**
 * query the mobile platform type of current test device
 * @param browser browser object
 */
function getMobilePlatformType(browser) {
    // TODO after upgrading the version of babel, replacing the MobilePlatFormType
    // by using a template literal type
    if (browser.isAndroid) {
        return isTablet(browser) ? 'android_tablet' : 'android_phone';
    }
    else if (browser.isIOS) {
        return isIPad(browser) ? 'ios_tablet' : 'ios_phone';
    }
    return 'web';
}
exports.getMobilePlatformType = getMobilePlatformType;
/**
 * check the current test device is iPad or not
 * @param browser browser object
 */
function isIPad(browser) {
    const deviceName = browser.capabilities['appium:deviceName'];
    return !!deviceName?.toLowerCase().includes('ipad');
}
/**
 * check the current test device is Android tablet or not
 * @param browser browser object
 */
function isTablet(browser) {
    const { deviceScreenDensity, deviceScreenSize } = browser.capabilities;
    // For android, based on https://developer.android.com/training/multiscreen/screensizes
    // when device's dp is equal or bigger than 600, will be treated as tablet, otherwise will be phone
    const dp = (parseInt(deviceScreenSize.split('[xX]')[0]) * 160, 10) / deviceScreenDensity;
    return dp >= 600;
}
//# sourceMappingURL=mobile-utils.js.map