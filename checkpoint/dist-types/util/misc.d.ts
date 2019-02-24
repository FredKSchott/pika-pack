export declare function sortAlpha(a: string, b: string): number;
export declare function sortOptionsByFlags(a: any, b: any): number;
export declare function entries<T>(obj: {
    [key: string]: T;
}): Array<[string, T]>;
export declare function removePrefix(pattern: string, prefix: string): string;
export declare function removeSuffix(pattern: string, suffix: string): string;
export declare function addSuffix(pattern: string, suffix: string): string;
export declare function hyphenate(str: string): string;
export declare function camelCase(str: string): string | null;
export declare function compareSortedArrays<T>(array1: Array<T>, array2: Array<T>): boolean;
export declare function sleep(ms: number): Promise<void>;
