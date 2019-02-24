/* @flow */
import _camelCase from 'camelcase';
export function sortAlpha(a, b) {
    // sort alphabetically in a deterministic way
    const shortLen = Math.min(a.length, b.length);
    for (let i = 0; i < shortLen; i++) {
        const aChar = a.charCodeAt(i);
        const bChar = b.charCodeAt(i);
        if (aChar !== bChar) {
            return aChar - bChar;
        }
    }
    return a.length - b.length;
}
export function sortOptionsByFlags(a, b) {
    const aOpt = a.flags.replace(/-/g, '');
    const bOpt = b.flags.replace(/-/g, '');
    return sortAlpha(aOpt, bOpt);
}
export function entries(obj) {
    const entries = [];
    if (obj) {
        for (const key in obj) {
            entries.push([key, obj[key]]);
        }
    }
    return entries;
}
export function removePrefix(pattern, prefix) {
    if (pattern.startsWith(prefix)) {
        pattern = pattern.slice(prefix.length);
    }
    return pattern;
}
export function removeSuffix(pattern, suffix) {
    if (pattern.endsWith(suffix)) {
        return pattern.slice(0, -suffix.length);
    }
    return pattern;
}
export function addSuffix(pattern, suffix) {
    if (!pattern.endsWith(suffix)) {
        return pattern + suffix;
    }
    return pattern;
}
export function hyphenate(str) {
    return str.replace(/[A-Z]/g, match => {
        return '-' + match.charAt(0).toLowerCase();
    });
}
export function camelCase(str) {
    if (/[A-Z]/.test(str)) {
        return null;
    }
    else {
        return _camelCase(str);
    }
}
export function compareSortedArrays(array1, array2) {
    if (array1.length !== array2.length) {
        return false;
    }
    for (let i = 0, len = array1.length; i < len; i++) {
        if (array1[i] !== array2[i]) {
            return false;
        }
    }
    return true;
}
export function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
