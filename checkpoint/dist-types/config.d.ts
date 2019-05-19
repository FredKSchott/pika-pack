import { Manifest } from './types.js';
import BaseReporter from './reporters/base-reporter.js';
export declare type ConfigOptions = {
    pipeline?: string;
};
export default class Config {
    cwd: string;
    reporter: BaseReporter;
    _manifest: any;
    manifest: Manifest;
    manifestIndent?: string;
    flags: ConfigOptions;
    constructor(reporter: BaseReporter, cwd: string, flags: ConfigOptions);
    loadPackageManifest(): Promise<Manifest>;
    readJson(loc: string, factory?: (filename: string) => Promise<any>): Promise<any>;
    savePackageManifest(newManifestData: object): Promise<Manifest>;
    getDistributions(): Promise<[any, any][]>;
}
