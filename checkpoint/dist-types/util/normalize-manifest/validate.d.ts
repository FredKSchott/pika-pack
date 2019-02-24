import { Reporter } from '../../reporters/index.js';
export declare function isValidPackageName(name: string): boolean;
declare type WarnFunction = (msg: string) => void;
export default function (info: any, isRoot: boolean, reporter: Reporter, warn: WarnFunction): void;
export declare function cleanDependencies(info: Object, isRoot: boolean, reporter: Reporter, warn: WarnFunction): void;
export {};
