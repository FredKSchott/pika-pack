/// <reference types="node" />
export declare const unlink: (path: string) => Promise<void>;
export declare const glob: (path: string, options?: Object) => Promise<Array<string>>;
export declare const mkdirp: (path: string) => Promise<void>;
import * as fs from 'fs';
export declare const open: typeof fs.open.__promisify__;
export declare const writeFile: typeof fs.writeFile.__promisify__;
export declare const readlink: typeof fs.readlink.__promisify__;
export declare const realpath: typeof fs.realpath.__promisify__;
export declare const readdir: typeof fs.readdir.__promisify__;
export declare const rename: typeof fs.rename.__promisify__;
export declare const access: typeof fs.access.__promisify__;
export declare const stat: typeof fs.stat.__promisify__;
export declare const exists: typeof fs.exists.__promisify__;
export declare const lstat: typeof fs.lstat.__promisify__;
export declare const chmod: typeof fs.chmod.__promisify__;
export declare const link: (arg1: fs.PathLike, arg2: fs.PathLike) => Promise<void>;
export declare const copyFile: typeof fs.copyFile.__promisify__;
export declare const readFile: (path: string) => Promise<string>;
export declare function readJson(loc: string): Promise<Object>;
export declare function readJsonAndFile(loc: string): Promise<{
    object: Object;
    content: string;
}>;
export declare type WalkFiles = Array<{
    relative: string;
    absolute: string;
    basename: string;
    mtime: number;
}>;
export declare function walk(dir: string, relativeDir?: string, ignoreBasenames?: Set<string>): Promise<WalkFiles>;
export declare function writeFilePreservingEol(path: string, data: string): Promise<void>;
