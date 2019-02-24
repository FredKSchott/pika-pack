import { Command } from 'commander';
import Config from '../config.js';
import { Reporter } from '../reporters/index.js';
declare type Flags = {
    publish?: boolean;
    out?: string;
    silent?: boolean;
    force?: boolean;
};
export declare function setFlags(commander: Command): void;
export declare function hasWrapper(commander: Object, args: Array<string>): boolean;
export declare class Build {
    constructor(flags: Flags, config: Config, reporter: Reporter);
    out: string;
    flags: Flags;
    config: Config;
    reporter: Reporter;
    totalNum: number;
    cleanup(): Promise<void>;
    init(isFull?: boolean): Promise<void>;
}
export declare function run(config: Config, reporter: Reporter, flags: Flags, args: Array<string>): Promise<void>;
export {};
