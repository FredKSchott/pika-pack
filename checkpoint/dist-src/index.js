import * as path from 'path';
import chalk from 'chalk';
import * as fs from 'fs';
import invariant from 'invariant';
import loudRejection from 'loud-rejection';
import { ConsoleReporter, JSONReporter } from './reporters/index.js';
import * as buildCommand from './commands/build.js';
import { MessageError } from '@pika/types';
import Config from './config.js';
import handleSignals from './util/signal-handler.js';
import { boolifyWithDefault } from './util/conversion.js';
import map from './util/map.js';
import stripBOM from 'strip-bom';
import uri2path from 'file-uri-to-path';
import yargs from 'yargs-parser';
// @ts-ignore
const currentFilename = uri2path(import.meta.url);
function getVersion() {
    const packageJsonContent = fs.readFileSync(path.resolve(currentFilename, '../../package.json'), { encoding: 'utf-8' });
    const { version } = map(JSON.parse(stripBOM(packageJsonContent)));
    return version;
}
function printHelp() {
    console.log(`
${chalk.bold(`@pika/pack`)} - Build npm packages without the mess.
${chalk.bold('Options:')}
    --cwd               Set the current working directory.
    --out               Set the output directory. Defaults to "pkg/".
    --pipeline          Set a build pipeline via JSON string.
    --force             Continue with the build when a build plugin fails or throws an exception.
    --json              Log output as JSON.
    --verbose           Log additional debugging information.
    --silent            Log almost nothing.
    --help              Print help.
    --version, -v       Print version.
    `.trim());
}
export async function cli(args) {
    const version = getVersion();
    loudRejection();
    handleSignals();
    // Handle special flags
    if (args.find(arg => arg === '--version' || arg === '-v')) {
        console.log(version.trim());
        process.exitCode = 0;
        return;
    }
    if (args.find(arg => arg === '--help')) {
        printHelp();
        process.exitCode = 0;
        return;
    }
    // Handle the legacy CLI interface
    if (args[2] === 'publish') {
        console.log(`The publish flow has moved to the @pika/cli package (included with this package).
Update your publish script to: ${chalk.bold('pika publish [flags]')}
`);
        process.exitCode = 1;
        return;
    }
    if (args[2] === 'build') {
        console.log(chalk.yellow(`Note: This CLI was recently deprecated. Update your build script to: ${chalk.bold('pika build [flags]')}`));
        args.splice(2, 1);
    }
    const flags = yargs(args);
    const cwd = flags.cwd || process.cwd();
    const Reporter = flags.json ? JSONReporter : ConsoleReporter;
    const reporter = new Reporter({
        emoji: true,
        verbose: flags.verbose,
        isSilent: boolifyWithDefault(process.env.PIKA_SILENT, false) || flags.silent,
    });
    const exit = (exitCode = 0) => {
        process.exitCode = exitCode;
        reporter.close();
    };
    const command = buildCommand;
    reporter.initPeakMemoryCounter();
    const outputWrapperEnabled = boolifyWithDefault(process.env.PIKA_WRAP_OUTPUT, true);
    const shouldWrapOutput = outputWrapperEnabled && !flags.json && command.hasWrapper();
    if (shouldWrapOutput) {
        reporter.header({ name: '@pika/pack', version });
    }
    const run = () => {
        invariant(command, 'missing command');
        return command.run(config, reporter, flags, args).then(exitCode => {
            if (shouldWrapOutput) {
                reporter.footer(false);
            }
            return exitCode;
        });
    };
    function onUnexpectedError(err) {
        function indent(str) {
            return '\n  ' + str.trim().split('\n').join('\n  ');
        }
        const log = [];
        log.push(`Arguments: ${indent(process.argv.join(' '))}`);
        log.push(`PATH: ${indent(process.env.PATH || 'undefined')}`);
        log.push(`Pika version: ${indent(version)}`);
        log.push(`Node version: ${indent(process.versions.node)}`);
        log.push(`Platform: ${indent(process.platform + ' ' + process.arch)}`);
        log.push(`Trace: ${indent(err.stack)}`);
        reporter.error(reporter.lang('unexpectedError', err.message));
    }
    const config = new Config(reporter, cwd, flags);
    await config.loadPackageManifest();
    try {
        // option "no-progress" stored in pika config
        const noProgressConfig = false; //config.registries.pika.getOption('no-progress');
        if (noProgressConfig) {
            reporter.disableProgress();
        }
        // verbose logs outputs process.uptime() with this line we can sync uptime to absolute time on the computer
        reporter.verbose(`current time: ${new Date().toISOString()}`);
        return run().then(exit);
    }
    catch (err) {
        reporter.verbose(err.stack);
        if (err instanceof MessageError) {
            reporter.error(err.message);
        }
        else {
            onUnexpectedError(err);
        }
        return exit(1);
    }
}
