/* @flow */
import { commands } from './index.js';
import { sortOptionsByFlags } from '../util/misc.js';
export function hasWrapper(flags, args) {
    return false;
}
export function setFlags(commander) {
    commander.description('Displays help information.');
}
export function run(config, reporter, commander, args) {
    if (args.length) {
        const commandName = args.shift();
        if (Object.prototype.hasOwnProperty.call(commands, commandName)) {
            const command = commands[commandName];
            if (command) {
                command.setFlags(commander);
                const examples = ((command && command.examples) || []).map(example => `    $ pika ${example}`);
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
