import type { UtamPageObject } from '@utam/types';
import type { EntryOptions } from '../run_utam';
import type { ResolvedUtamProjectConfig } from '../types';
export declare class ProfileRenderer {
    /** Set of profile names */
    private configProfilesNames;
    /** Map of profile name and associated values */
    private configProfilesNamesToValues;
    /** In memory data structure storing profiles dependencies */
    private profileDependencyBuilder;
    /** Value of the module property coming from the compiler config */
    private moduleName;
    /** Indicates if we encountered a missing profile in the compiler config */
    hasMissingProfilesInProjectConfig: boolean;
    constructor();
    /**
     * Load the profiles from the UTAM compiler configuration object and initialize the underlying data structures
     * used to check for matching profiles between the compiler configuration and the page object profiles values
     *
     * @param config UTAM compiler configuration object
     */
    loadProfileConfig(config: ResolvedUtamProjectConfig): void;
    /**
     * Method that is the entry point for the UTAM runner. This method ensures that if we have profiles defined in the
     * compiler configuration and add the matching profiles to the profile configuration object.
     * @param pageObject current page object being processed
     * @param pageObjectFileData file metadata associated with the current page object entry
     */
    setProfiles(pageObject: UtamPageObject, pageObjectFileData: EntryOptions): void;
    /**
     * Utility method that is used to indicate if there has been page object with profiles
     * @returns true if the instance has profiles, false otherwise
     */
    hasProfiles(): boolean;
    /**
     * Serialize and returns the profile configuration object
     * @returns the serialized representation of the profile configuration
     */
    render(): string;
    /**
     * Method that injects profiles defined in page object into the profile configuration object if there's a matching
     * profile in the compiler configuration.
     * @param pageObject current page object being processed
     * @param pageObjectFileData file metadata associated with the current page object entry
     */
    private processProfiles;
    /**
     * Method that indicates if the page object profile has a matching one in the compiler configuration
     * @param name profile name
     * @param value profile value
     * @returns true if there's a matching profile between the page object the compiler config, false otherwise
     */
    private hasMatchingProfile;
    /**
     * Initialize in memory data structures when loading profiles from the compiler configuration.
     * This operation is executed once and is designed that way so that we can
     * @param profiles UTAM compiler profiles configuration object
     */
    private initInMemoryProfiles;
    /**
     * User defined type guard that narrows page object implementing interface
     * @param pageObject page object being processed via the runner
     */
    private isPageObjectImplementingInterface;
}
//# sourceMappingURL=profiles.d.ts.map