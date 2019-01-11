import * as path from 'path';
import { Command } from 'commander';
import {Lint} from 'standard-pkg';

import {Reporter} from '../reporters/index';
import Config from '../config';

type Flags = {};

export function setFlags(commander: Command) {
  commander.description('Validates a package for issues before publishing to npm.');
}

export function hasWrapper(commander: Command, args: Array<string>): boolean {
  return true;
}

export async function run(config: Config, reporter: Reporter, flags: Flags, args: Array<string>): Promise<void> {
  const {cwd} = config;
  const dir = args.length > 0 ? path.resolve(cwd, args[0]) : 'pkg/';
  const linter = new Lint(dir, flags, config, reporter);
  await linter.init();
  console.log(``);
  linter.summary();
}
