import Config, { BuildFlags } from '../config.js';
import { Reporter } from '../reporters/index.js';
export declare function hasWrapper(): boolean;
export declare const examples: any;
export declare class Build {
    constructor(flags: BuildFlags, config: Config, reporter: Reporter);
    out: string;
    flags: BuildFlags;
    config: Config;
    reporter: Reporter;
    totalNum: number;
    cleanup(): Promise<void>;
    init(isFull?: boolean): Promise<void>;
}
export declare function run(config: Config, reporter: Reporter, flags: BuildFlags, args: Array<string>): Promise<void>;
