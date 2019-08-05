import { Manifest } from './types.js';
import BaseReporter from './reporters/base-reporter.js';
export interface BuildFlags {
    publish?: boolean;
    out?: string;
    silent?: boolean;
    force?: boolean;
}
export interface GlobalFlags extends BuildFlags {
    cwd?: string;
    pipeline?: string;
    verbose?: boolean;
    json?: boolean;
}
export default class Config {
    cwd: string;
    reporter: BaseReporter;
    _manifest: any;
    manifest: Manifest;
    flags: GlobalFlags;
    constructor(reporter: BaseReporter, cwd: string, flags: GlobalFlags);
    loadPackageManifest(): Promise<Manifest>;
    readJson(loc: string, factory?: (filename: string) => Promise<any>): Promise<any>;
    getDistributions(): Promise<[any, any][]>;
}
