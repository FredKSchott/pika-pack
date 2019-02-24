import { Manifest } from './types.js';
import BaseReporter from './reporters/base-reporter.js';
export declare type ConfigOptions = {
    cwd?: string;
    _cacheRootFolder?: string;
    tempFolder?: string;
    ignoreScripts?: boolean;
    ignorePlatform?: boolean;
    ignoreEngines?: boolean;
    production?: boolean;
    binLinks?: boolean;
    commandName?: string;
    otp?: string;
};
export default class Config {
    cwd: string;
    reporter: BaseReporter;
    _manifest: any;
    manifest: Manifest;
    manifestIndent?: string;
    constructor(reporter: BaseReporter, cwd?: string);
    loadPackageManifest(): Promise<Manifest>;
    readJson(loc: string, factory?: (filename: string) => Promise<any>): Promise<any>;
    savePackageManifest(newManifestData: object): Promise<Manifest>;
    getDistributions(): Promise<Array<[any, any]>>;
}
