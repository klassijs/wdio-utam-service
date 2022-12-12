"use strict";
/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileRenderer = void 0;
const path_1 = __importDefault(require("path"));
const compiler_1 = require("@utam/compiler");
const core_1 = require("@utam/core");
class ProfileDependencyBuilder {
    constructor() {
        this.existingProfiles = new Set();
        this.result = {};
        this._aliases = {};
    }
    /**
     * Set the _aliases value to the one sets in the compiler configuration if any has been configured
     * Aliases are used to set interfaces and implementations' module specifiers to values
     * that can be resolved by node when the UTAM URIs are overrided.
     * @param alias aliases defined in the compiler configuration
     */
    setAlias(alias) {
        if (alias) {
            this._aliases = alias;
        }
    }
    /**
     * Add or append a profile dependency record to the result object. This method holds the logic to check
     * for existing profile and switch between add or append operation.
     * @param profileDependency profile dependency record to add or append
     */
    addProfileDependency(profileDependency) {
        const { name, value } = profileDependency;
        const key = `${name}_${value}`;
        if (!this.existingProfiles.has(key)) {
            this.addProfile(profileDependency);
            this.existingProfiles.add(key);
        }
        else {
            this.appendProfile(profileDependency);
        }
    }
    /**
     * Add a profile dependency record to the result data structure
     * @remark note that implementation must sit next to interface as their URI is inferred relatively to interface
     * @param profileDependency profile dependency record to add
     */
    addProfile(profileDependency) {
        const { name, value } = profileDependency;
        const { interfaceSpecifier, implementationSpecifier } = this.getProfileSpecifiers(profileDependency);
        this.result[name] = this.result[name] ? this.result[name] : {};
        this.result[name][value] = [
            {
                interface: interfaceSpecifier,
                implementation: implementationSpecifier,
            },
        ];
    }
    /**
     * Append a profile dependency record to the result data structure
     * @remark note that implementation must sit next to interface as their URI is infered relatively to interface
     * @param profileDependency profile dependency record to append
     */
    appendProfile(profileDependency) {
        const { name, value } = profileDependency;
        const { interfaceSpecifier, implementationSpecifier } = this.getProfileSpecifiers(profileDependency);
        this.result[name][value].push({
            interface: interfaceSpecifier,
            implementation: implementationSpecifier,
        });
    }
    /**
     * Get the module specifiers for interface and implementation that will be written in the profile config
     * This function will replace the path parts that matches aliases so that interfaces and implementations
     * paths can be resolved when the compiler uses aliases
     * @param profileDependency  profile dependency record
     * @returns the resolved path specifier for the interface and implementation
     */
    getProfileSpecifiers(profileDependency) {
        const { interface: interfaceType, pageObjectName } = profileDependency;
        const interfaceSpecifier = compiler_1.replaceTypeString(interfaceType, this._aliases);
        const implementationSpecifier = path_1.default.join(interfaceSpecifier, '..', pageObjectName);
        return { interfaceSpecifier, implementationSpecifier };
    }
    /**
     * Utility method that is used in ProfileRenderer to indicate if there has been page object with profiles
     * @returns true if the instance has profiles, false otherwise
     */
    hasProfile() {
        return this.existingProfiles.size > 0;
    }
    /**
     * Returns the result object which holds the profile configuration data before serialization
     */
    renderConfig() {
        return this.result;
    }
}
class ProfileRenderer {
    constructor() {
        this.configProfilesNames = new Set();
        this.configProfilesNamesToValues = new Map();
        this.hasMissingProfilesInProjectConfig = false;
        this.profileDependencyBuilder = new ProfileDependencyBuilder();
        this.moduleName = null;
    }
    /**
     * Load the profiles from the UTAM compiler configuration object and initialize the underlying data structures
     * used to check for matching profiles between the compiler configuration and the page object profiles values
     *
     * @param config UTAM compiler configuration object
     */
    loadProfileConfig(config) {
        const { alias, profiles, module } = config;
        this.profileDependencyBuilder.setAlias(alias);
        this.initInMemoryProfiles(profiles);
        this.moduleName = module ?? null;
    }
    /**
     * Method that is the entry point for the UTAM runner. This method ensures that if we have profiles defined in the
     * compiler configuration and add the matching profiles to the profile configuration object.
     * @param pageObject current page object being processed
     * @param pageObjectFileData file metadata associated with the current page object entry
     */
    setProfiles(pageObject, pageObjectFileData) {
        if (this.isPageObjectImplementingInterface(pageObject)) {
            if (!this.moduleName) {
                throw new Error(`Missing "module" property in the compiler configuration when the "${pageObjectFileData.fileName}" page object uses profiles`);
            }
            this.processProfiles(pageObject, pageObjectFileData);
        }
    }
    /**
     * Utility method that is used to indicate if there has been page object with profiles
     * @returns true if the instance has profiles, false otherwise
     */
    hasProfiles() {
        return this.profileDependencyBuilder.hasProfile();
    }
    /**
     * Serialize and returns the profile configuration object
     * @returns the serialized representation of the profile configuration
     */
    render() {
        const moduleProfiles = this.profileDependencyBuilder.renderConfig();
        return JSON.stringify(moduleProfiles, null, 4).concat('\n');
    }
    /**
     * Method that injects profiles defined in page object into the profile configuration object if there's a matching
     * profile in the compiler configuration.
     * @param pageObject current page object being processed
     * @param pageObjectFileData file metadata associated with the current page object entry
     */
    processProfiles(pageObject, pageObjectFileData) {
        const { profile = [{ [core_1.DEFAULT_PROFILE_NAME]: [core_1.DEFAULT_PROFILE_VALUE] }] } = pageObject;
        const poProfiles = profile.reduce((acc, i) => ({ ...acc, ...i }), {});
        const { entry, fileName } = pageObjectFileData;
        const [pageObjectName] = fileName.split('.');
        for (const poProfile of Object.entries(poProfiles)) {
            const [name, values] = poProfile;
            process.stdout.write(`Loading profile "${name}" from ${entry}... `);
            for (const value of values) {
                if (this.hasMatchingProfile(name, value)) {
                    const { implements: interfaceType } = pageObject;
                    this.profileDependencyBuilder.addProfileDependency({
                        name,
                        value,
                        interface: interfaceType,
                        pageObjectName,
                    });
                }
                else {
                    this.hasMissingProfilesInProjectConfig = true;
                    throw new Error(`Unable to find a matching profile in the compiler configuration for profile name "${name}" with value "${value}"`);
                }
            }
            process.stdout.write(`[DONE]\n`);
        }
    }
    /**
     * Method that indicates if the page object profile has a matching one in the compiler configuration
     * @param name profile name
     * @param value profile value
     * @returns true if there's a matching profile between the page object the compiler config, false otherwise
     */
    hasMatchingProfile(name, value) {
        return !!(this.configProfilesNames.has(name) && this.configProfilesNamesToValues.get(name)?.has(value));
    }
    /**
     * Initialize in memory data structures when loading profiles from the compiler configuration.
     * This operation is executed once and is designed that way so that we can
     * @param profiles UTAM compiler profiles configuration object
     */
    initInMemoryProfiles(profiles) {
        this.configProfilesNames = new Set(profiles.map(({ name }) => name));
        this.configProfilesNamesToValues = new Map(profiles.map(({ name, values }) => [name, new Set(values)]));
    }
    /**
     * User defined type guard that narrows page object implementing interface
     * @param pageObject page object being processed via the runner
     */
    isPageObjectImplementingInterface(pageObject) {
        return 'implements' in pageObject;
    }
}
exports.ProfileRenderer = ProfileRenderer;
//# sourceMappingURL=profiles.js.map