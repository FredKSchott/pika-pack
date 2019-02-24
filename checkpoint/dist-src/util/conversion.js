const FALSY_STRINGS = new Set(['0', 'false']);
export function boolify(val) {
    return !FALSY_STRINGS.has(val.toString().toLowerCase());
}
export function boolifyWithDefault(val, defaultResult) {
    return val === '' || val === null || val === undefined ? defaultResult : boolify(val);
}
