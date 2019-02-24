import { Reporter } from '../reporters/index.js';
import Config from '../config.js';
import { Command } from 'commander';
export declare function hasWrapper(flags: Object, args: Array<string>): boolean;
export declare function setFlags(commander: Command): void;
export declare function run(config: Config, reporter: Reporter, commander: Command, args: Array<string>): Promise<void>;
