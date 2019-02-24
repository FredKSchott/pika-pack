import * as path from 'path';
import { Command } from 'commander';
import * as fs from 'fs';
import invariant from 'invariant';
import loudRejection from 'loud-rejection';
import semver from 'semver';
import { ConsoleReporter, JSONReporter } from './reporters/index.js';
import { commands } from './commands/index.js';
import * as helpCommand from './commands/help.js';
import * as constants from './constants.js';
import { MessageError } from '@pika/types';
import Config from './config.js';
import handleSignals from './util/signal-handler.js';
import { boolify, boolifyWithDefault } from './util/conversion.js';
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
export async function main({ startArgs, args, endArgs, }) {
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
    commander.option('--emoji [bool]', 'enable emoji in output', boolify, process.platform === 'darwin' || process.env.TERM_PROGRAM === 'Hyper' || process.env.TERM_PROGRAM === 'HyperTerm');
    commander.option('-s, --silent', 'skip Pika console logs, other types of logs (script output) will be printed');
    commander.option('--cwd <cwd>', 'working directory to use', process.cwd());
    commander.option('--no-progress', 'disable progress bar');
    commander.option('--no-node-version-check', 'do not warn when using a potentially unsupported Node version');
    // if -v is the first command, then always exit after returning the version
    if (args[0] === '-v') {
        console.log(version.trim());
        process.exitCode = 0;
        return;
    }
    // get command name
    const firstNonFlagIndex = args.findIndex((arg, idx, arr) => {
        const isOption = arg.startsWith('-');
        const prev = idx > 0 && arr[idx - 1];
        const prevOption = prev && prev.startsWith('-') && commander.optionFor(prev);
        const boundToPrevOption = prevOption && (prevOption.optional || prevOption.required);
        return !isOption && !boundToPrevOption;
    });
    let preCommandArgs;
    let commandName = '';
    if (firstNonFlagIndex > -1) {
        preCommandArgs = args.slice(0, firstNonFlagIndex);
        commandName = args[firstNonFlagIndex];
        args = args.slice(firstNonFlagIndex + 1);
    }
    else {
        preCommandArgs = args;
        args = [];
    }
    let isKnownCommand = Object.prototype.hasOwnProperty.call(commands, commandName);
    const isHelp = arg => arg === '--help' || arg === '-h';
    const helpInPre = preCommandArgs.findIndex(isHelp);
    const helpInArgs = args.findIndex(isHelp);
    const setHelpMode = () => {
        if (isKnownCommand) {
            args.unshift(commandName);
        }
        commandName = 'help';
        isKnownCommand = true;
    };
    if (helpInPre > -1) {
        preCommandArgs.splice(helpInPre);
        setHelpMode();
    }
    else if (isKnownCommand && helpInArgs === 0) {
        args.splice(helpInArgs);
        setHelpMode();
    }
    if (!commandName) {
        commandName = 'help';
        isKnownCommand = true;
    }
    if (!isKnownCommand) {
        // if command is not recognized, then set default to `run`
        args.unshift(commandName);
        commandName = 'help';
    }
    const command = commandName === 'help' ? helpCommand : commands[commandName];
    commander.originalArgs = args;
    args = [...preCommandArgs, ...args];
    command.setFlags(commander);
    commander.parse([
        ...startArgs,
        // we use this for https://github.com/tj/commander.js/issues/346, otherwise
        // it will strip some args that match with any options
        'this-arg-will-get-stripped-later',
        ...args,
    ]);
    commander.args = commander.args.concat(endArgs.slice(1));
    // we strip cmd
    console.assert(commander.args.length >= 1);
    console.assert(commander.args[0] === 'this-arg-will-get-stripped-later');
    commander.args.shift();
    //
    const Reporter = commander.json ? JSONReporter : ConsoleReporter;
    const reporter = new Reporter({
        emoji: process.stdout.isTTY && commander.emoji,
        verbose: commander.verbose,
        noProgress: !commander.progress,
        isSilent: boolifyWithDefault(process.env.PIKA_SILENT, false) || commander.silent,
        nonInteractive: commander.nonInteractive,
    });
    const exit = (exitCode = 0) => {
        if (exitCode === 0) {
            clearErrorReport();
        }
        process.exitCode = exitCode;
        reporter.close();
    };
    reporter.initPeakMemoryCounter();
    const outputWrapperEnabled = boolifyWithDefault(process.env.PIKA_WRAP_OUTPUT, true);
    const shouldWrapOutput = outputWrapperEnabled && !commander.json && command.hasWrapper(commander, commander.args);
    // if (shouldWrapOutput) {
    reporter.header(commandName, { name: '@pika/pack', version });
    // }
    if (commander.nodeVersionCheck && !semver.satisfies(process.versions.node, constants.SUPPORTED_NODE_VERSIONS)) {
        reporter.warn(reporter.lang('unsupportedNodeVersion', process.versions.node, constants.SUPPORTED_NODE_VERSIONS));
    }
    if (command.noArguments && commander.args.length) {
        reporter.error(reporter.lang('noArguments'));
        // reporter.info(command.getDocsInfo);
        exit(1);
        return;
    }
    //
    // if (commander.yes) {
    //   reporter.warn(reporter.lang('yesWarning'));
    // }
    //
    const run = () => {
        invariant(command, 'missing command');
        // if (warnAboutRunDashDash) {
        //   reporter.warn(reporter.lang('dashDashDeprecation'));
        // }
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
        const errorReportLoc = writeErrorReport(log);
        reporter.error(reporter.lang('unexpectedError', err.message));
        if (errorReportLoc) {
            reporter.info(reporter.lang('bugReport', errorReportLoc));
        }
    }
    function writeErrorReport(log) {
        const errorReportLoc = path.join(config.cwd, 'pika-error.log');
        try {
            fs.writeFileSync(errorReportLoc, log.join('\n\n') + '\n');
        }
        catch (err) {
            reporter.error(reporter.lang('fileWriteError', errorReportLoc, err.message));
            return undefined;
        }
        return errorReportLoc;
    }
    function clearErrorReport() {
        const errorReportLoc = path.join(config.cwd, 'pika-error.log');
        if (fs.existsSync(errorReportLoc)) {
            try {
                fs.unlinkSync(errorReportLoc);
            }
            catch (err) {
                reporter.error(reporter.lang('fileDeleteError', errorReportLoc, err.message));
                return undefined;
            }
        }
        return errorReportLoc;
    }
    const cwd = command.shouldRunInCurrentCwd ? commander.cwd : findProjectRoot(commander.cwd);
    const config = new Config(reporter, cwd);
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
        // if (command.getDocsInfo) {
        //   reporter.info(command.getDocsInfo);
        // }
        return exit(1);
    }
}
async function start() {
    // ignore all arguments after a --
    const doubleDashIndex = process.argv.findIndex(element => element === '--');
    const startArgs = process.argv.slice(0, 2);
    const args = process.argv.slice(2, doubleDashIndex === -1 ? process.argv.length : doubleDashIndex);
    const endArgs = doubleDashIndex === -1 ? [] : process.argv.slice(doubleDashIndex);
    await main({ startArgs, args, endArgs });
}
export const autoRun = false;
export default start;
