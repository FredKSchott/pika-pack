import * as path from 'path';
import chalk from 'chalk';
import { Command } from 'commander';
import * as fs from 'fs';
import invariant from 'invariant';
import loudRejection from 'loud-rejection';
import semver from 'semver';
import { ConsoleReporter, JSONReporter } from './reporters/index.js';
import * as buildCommand from './commands/build.js';
import * as helpCommand from './commands/help.js';
import * as constants from './constants.js';
import { MessageError } from '@pika/types';
import Config from './config.js';
import handleSignals from './util/signal-handler.js';
import { boolifyWithDefault } from './util/conversion.js';
import map from './util/map.js';
import stripBOM from 'strip-bom';
import uri2path from 'file-uri-to-path';
const commander = new Command();
// @ts-ignore
const currentFilename = uri2path(import.meta.url);
function getVersion() {
    const packageJsonContent = fs.readFileSync(path.resolve(currentFilename, '../../package.json'), { encoding: 'utf-8' });
    const { version } = map(JSON.parse(stripBOM(packageJsonContent)));
    return version;
}
function findProjectRoot(base) {
    let prev = null;
    let dir = base;
    do {
        if (fs.existsSync(path.join(dir, constants.NODE_PACKAGE_JSON))) {
            return dir;
        }
        prev = dir;
        dir = path.dirname(dir);
    } while (dir !== prev);
    return base;
}
export async function cli(args) {
    const version = getVersion();
    loudRejection();
    handleSignals();
    // set global options
    commander.version(version, '-v, --version');
    commander.usage('[command] [flags]');
    commander.option('--verbose', 'output verbose messages on internal operations');
    commander.option('--json', 'format Pika log messages as lines of JSON (see jsonlines.org)');
    // commander.option('--force', 'install and build packages even if they were built before, overwrite lockfile');
    // commander.option('--prod, --production [prod]', '', boolify);
    // commander.option(
    //   '--emoji [bool]',
    //   'enable emoji in output',
    //   boolify,
    //   process.platform === 'darwin' || process.env.TERM_PROGRAM === 'Hyper' || process.env.TERM_PROGRAM === 'HyperTerm',
    // );
    commander.description('Prepares your package out directory (pkg/) for publishing.');
    commander.usage('pika build [flags]');
    commander.option('-s, --silent', 'skip Pika console logs, other types of logs (script output) will be printed');
    commander.option('--cwd <cwd>', 'working directory to use', process.cwd());
    commander.option('--no-progress', 'disable progress bar');
    commander.option('--no-node-version-check', 'do not warn when using a potentially unsupported Node version');
    commander.option('--pipeline <pipeline>', 'the build pipeline to run');
    commander.option('-O, --out <path>', 'Where to write to');
    commander.option('--force', 'Whether to ignore failed build plugins and continue through errors.');
    commander.option('-P, --publish', 'Whether to include publish-only builds like unpkg & types.');
    // if -v is the first command, then always exit after returning the version
    if (args[2] === '-v') {
        console.log(version.trim());
        process.exitCode = 0;
        return;
    }
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
    commander.parse(args);
    const Reporter = commander.json ? JSONReporter : ConsoleReporter;
    const reporter = new Reporter({
        emoji: process.stdout.isTTY && commander.emoji,
        verbose: commander.verbose,
        noProgress: !commander.progress,
        isSilent: boolifyWithDefault(process.env.PIKA_SILENT, false) || commander.silent,
        nonInteractive: commander.nonInteractive,
    });
    const exit = (exitCode = 0) => {
        process.exitCode = exitCode;
        reporter.close();
    };
    const isHelp = arg => arg === '--help' || arg === '-h';
    const command = args.find(isHelp) ? helpCommand : buildCommand;
    reporter.initPeakMemoryCounter();
    const outputWrapperEnabled = boolifyWithDefault(process.env.PIKA_WRAP_OUTPUT, true);
    const shouldWrapOutput = outputWrapperEnabled && !commander.json && command.hasWrapper(commander, commander.args);
    if (shouldWrapOutput) {
        reporter.header({ name: '@pika/pack', version });
    }
    if (commander.nodeVersionCheck && !semver.satisfies(process.versions.node, constants.SUPPORTED_NODE_VERSIONS)) {
        reporter.warn(reporter.lang('unsupportedNodeVersion', process.versions.node, constants.SUPPORTED_NODE_VERSIONS));
    }
    const run = () => {
        invariant(command, 'missing command');
        return command.run(config, reporter, commander, commander.args).then(exitCode => {
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
    const cwd = findProjectRoot(commander.cwd);
    const config = new Config(reporter, cwd, commander);
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
