/* @flow */

import {commands} from './index.js';
import {Reporter} from '../reporters/index.js';
import Config from '../config.js';
import {sortOptionsByFlags} from '../util/misc.js';
import { Command } from 'commander';

export function hasWrapper(flags: Object, args: Array<string>): boolean {
  return false;
}

export function setFlags(commander: Command) {
  commander.description('Displays help information.');
}

export function run(config: Config, reporter: Reporter, commander: Command, args: Array<string>): Promise<void> {
  if (args.length) {
    const commandName = args.shift();
    if (Object.prototype.hasOwnProperty.call(commands, commandName)) {
      const command = commands[commandName];
      if (command) {
        command.setFlags(commander);
        const examples: Array<string> = ((command && command.examples) || []).map(example => `    $ pika ${example}`);
        if (examples.length) {
          commander.on('--help', () => {
            reporter.log(reporter.lang('helpExamples', reporter.rawText(examples.join('\n'))));
          });
        }
        // eslint-disable-next-line pika-internal/warn-language
        // commander.on('--help', () => reporter.log('  ' + getDocsInfo(commandName) + '\n'));
        commander.help();
        return Promise.resolve();
      }
    }
  }

  commander.options.sort(sortOptionsByFlags);

  commander.help();
  return Promise.resolve();
}
