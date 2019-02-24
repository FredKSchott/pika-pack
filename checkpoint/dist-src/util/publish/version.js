import semver from "semver";
export const SEMVER_INCREMENTS = [
    "patch",
    "minor",
    "major",
    "prepatch",
    "preminor",
    "premajor",
    "prerelease"
];
export const PRERELEASE_VERSIONS = [
    "prepatch",
    "preminor",
    "premajor",
    "prerelease"
];
const isValidVersion = input => Boolean(semver.valid(input));
export function isValidVersionInput(input) {
    return SEMVER_INCREMENTS.includes(input) || isValidVersion(input);
}
export function isPrereleaseVersion(version) {
    return (PRERELEASE_VERSIONS.includes(version) || Boolean(semver.prerelease(version)));
}
export function getNewVersion(oldVersion, input) {
    if (!isValidVersionInput(input)) {
        throw new Error(`Version should be either ${SEMVER_INCREMENTS.join(", ")} or a valid semver version.`);
    }
    return SEMVER_INCREMENTS.includes(input)
        ? semver.inc(oldVersion, input)
        : input;
}
export function isVersionGreater(oldVersion, newVersion) {
    if (!isValidVersion(newVersion)) {
        throw new Error("Version should be a valid semver version.");
    }
    return semver.gt(newVersion, oldVersion);
}
