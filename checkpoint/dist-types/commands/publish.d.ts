import { Command } from 'commander';
import Config from '../config.js';
import { Reporter } from '../reporters/index.js';
declare type Flags = {
    cleanup: boolean;
    yolo: boolean;
    anyBranch: boolean;
    publish: boolean;
    tag: boolean;
    yarn: boolean;
    contents: boolean;
    otp?: string;
    out?: string;
};
export declare function setFlags(commander: Command): void;
export declare function hasWrapper(): boolean;
export declare class Publish {
    constructor(flags: Flags, config: Config, reporter: Reporter);
    out: string;
    flags: Flags;
    config: Config;
    reporter: Reporter;
    totalNum: number;
    init(options: any): Promise<void>;
}
export declare function run(config: any, reporter: any, flags: any, args: any): Promise<void>;
export {};
