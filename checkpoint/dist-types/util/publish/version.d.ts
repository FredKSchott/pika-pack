export declare const SEMVER_INCREMENTS: string[];
export declare const PRERELEASE_VERSIONS: string[];
export declare function isValidVersionInput(input: any): boolean;
export declare function isPrereleaseVersion(version: any): boolean;
export declare function getNewVersion(oldVersion: any, input: any): any;
export declare function isVersionGreater(oldVersion: any, newVersion: any): any;
