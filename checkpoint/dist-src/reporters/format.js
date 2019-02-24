function formatFunction(...strs) {
    return strs.join(' ');
}
export const defaultFormatter = {
    bold: formatFunction,
    dim: formatFunction,
    italic: formatFunction,
    underline: formatFunction,
    inverse: formatFunction,
    strikethrough: formatFunction,
    black: formatFunction,
    red: formatFunction,
    green: formatFunction,
    yellow: formatFunction,
    blue: formatFunction,
    magenta: formatFunction,
    cyan: formatFunction,
    white: formatFunction,
    gray: formatFunction,
    grey: formatFunction,
    stripColor: formatFunction,
};
