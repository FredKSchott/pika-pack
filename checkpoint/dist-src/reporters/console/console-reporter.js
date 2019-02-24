import chalk from 'chalk';
import * as inquirer from 'inquirer';
import read from 'read';
import * as readline from 'readline';
import stripAnsi from 'strip-ansi';
import * as tty from 'tty';
import { inspect } from 'util';
import { removeSuffix } from '../../util/misc.js';
import BaseReporter from '../base-reporter.js';
import { getFormattedOutput, recurseTree, sortTrees } from './helpers/tree-helper.js';
import Progress from './progress-bar.js';
import Spinner from './spinner-progress.js';
import { clearLine } from './util.js';
const AUDIT_COL_WIDTHS = [15, 62];
const auditSeverityColors = {
    info: chalk.bold,
    low: chalk.bold,
    moderate: chalk.yellow,
    high: chalk.red,
    critical: chalk.bgRed,
};
// fixes bold on windows
if (process.platform === 'win32' && !(process.env.TERM && /^xterm/i.test(process.env.TERM))) {
    // @ts-ignore
    chalk.bold._styles[0].close += '\u001b[m';
}
export default class ConsoleReporter extends BaseReporter {
    constructor(opts) {
        super(opts);
        this._lastCategorySize = 0;
        this._spinners = new Set();
        this.format = chalk;
        this.format.stripColor = stripAnsi;
        this.isSilent = !!opts.isSilent;
    }
    _prependEmoji(msg, emoji) {
        if (this.emoji && emoji && this.isTTY) {
            msg = `${emoji}  ${msg}`;
        }
        return msg;
    }
    _logCategory(category, color, msg) {
        this._lastCategorySize = category.length;
        this._log(`${this.format[color](category)} ${msg}`);
    }
    _verbose(msg) {
        this._logCategory('verbose', 'grey', `${process.uptime()} ${msg}`);
    }
    _verboseInspect(obj) {
        this.inspect(obj);
    }
    close() {
        for (const spinner of this._spinners) {
            spinner.stop();
        }
        this._spinners.clear();
        this.stopProgress();
        super.close();
    }
    table(head, body) {
        //
        head = head.map((field) => this.format.underline(field));
        //
        const rows = [head].concat(body);
        // get column widths
        const cols = [];
        for (let i = 0; i < head.length; i++) {
            const widths = rows.map((row) => this.format.stripColor(row[i]).length);
            cols[i] = Math.max(...widths);
        }
        //
        const builtRows = rows.map((row) => {
            for (let i = 0; i < row.length; i++) {
                const field = row[i];
                const padding = cols[i] - this.format.stripColor(field).length;
                row[i] = field + ' '.repeat(padding);
            }
            return row.join(' ');
        });
        this.log(builtRows.join('\n'));
    }
    step(current, total, msg, emoji) {
        msg = this._prependEmoji(msg, emoji);
        if (msg.endsWith('?')) {
            msg = `${removeSuffix(msg, '?')}...?`;
        }
        else {
            msg += '...';
        }
        this.log(`${this.format.dim(`[${current}/${total}]`)} ${msg}`);
    }
    inspect(value) {
        if (typeof value !== 'number' && typeof value !== 'string') {
            value = inspect(value, {
                breakLength: 0,
                colors: this.isTTY,
                depth: null,
                maxArrayLength: null,
            });
        }
        this.log(String(value), { force: true });
    }
    list(key, items, hints) {
        const gutterWidth = (this._lastCategorySize || 2) - 1;
        if (hints) {
            for (const item of items) {
                this._log(`${' '.repeat(gutterWidth)}- ${this.format.bold(item)}`);
                this._log(`  ${' '.repeat(gutterWidth)} ${hints[item]}`);
            }
        }
        else {
            for (const item of items) {
                this._log(`${' '.repeat(gutterWidth)}- ${item}`);
            }
        }
    }
    header(command, pkg) {
        this.log(this.format.bold(`${pkg.name} ${command} v${pkg.version}`));
    }
    footer(showPeakMemory) {
        this.stopProgress();
        const totalTime = (this.getTotalTime() / 1000).toFixed(2);
        let msg = `Done in ${totalTime}s.`;
        if (showPeakMemory) {
            const peakMemory = (this.peakMemory / 1024 / 1024).toFixed(2);
            msg += ` Peak memory usage ${peakMemory}MB.`;
        }
        this.log(this._prependEmoji(msg, '✨'));
    }
    log(msg, { force = false } = {}) {
        this._lastCategorySize = 0;
        this._log(msg, { force });
    }
    _log(msg, { force = false } = {}) {
        if (this.isSilent && !force) {
            return;
        }
        clearLine(this.stdout);
        this.stdout.write(`${msg}\n`);
    }
    success(msg) {
        this._logCategory('success', 'green', msg);
    }
    error(msg) {
        clearLine(this.stderr);
        this.stderr.write(`${this.format.red('error')} ${msg}\n`);
    }
    info(msg) {
        this._logCategory('info', 'blue', msg);
    }
    command(command) {
        this.log(this.format.dim(`$ ${command}`));
    }
    warn(msg) {
        clearLine(this.stderr);
        this.stderr.write(`${this.format.yellow('warning')} ${msg}\n`);
    }
    question(question, options = {}) {
        if (!process.stdout.isTTY) {
            return Promise.reject(new Error("Can't answer a question unless a user TTY"));
        }
        return new Promise((resolve, reject) => {
            read({
                prompt: `${this.format.dim('question')} ${question}: `,
                silent: !!options.password,
                output: this.stdout,
                input: this.stdin,
            }, (err, answer) => {
                if (err) {
                    if (err.message === 'canceled') {
                        process.exitCode = 1;
                    }
                    reject(err);
                }
                else {
                    if (!answer && options.required) {
                        this.error(this.lang('answerRequired'));
                        resolve(this.question(question, options));
                    }
                    else {
                        resolve(answer);
                    }
                }
            });
        });
    }
    // handles basic tree output to console
    tree(key, trees, { force = false } = {}) {
        this.stopProgress();
        //
        if (this.isSilent && !force) {
            return;
        }
        const output = ({ name, children, hint, color }, titlePrefix, childrenPrefix) => {
            const formatter = this.format;
            const out = getFormattedOutput({
                prefix: titlePrefix,
                hint,
                color,
                name,
                formatter,
            });
            this.stdout.write(out);
            if (children && children.length) {
                recurseTree(sortTrees(children), childrenPrefix, output);
            }
        };
        recurseTree(sortTrees(trees), '', output);
    }
    activitySet(total, workers) {
        if (!this.isTTY || this.noProgress) {
            return super.activitySet(total, workers);
        }
        const spinners = [];
        const reporterSpinners = this._spinners;
        for (let i = 1; i < workers; i++) {
            this.log('');
        }
        for (let i = 0; i < workers; i++) {
            const spinner = new Spinner(this.stderr, i);
            reporterSpinners.add(spinner);
            spinner.start();
            let prefix = null;
            let current = 0;
            const updatePrefix = () => {
                spinner.setPrefix(`${this.format.dim(`[${current === 0 ? '-' : current}/${total}]`)} `);
            };
            const clear = () => {
                prefix = null;
                current = 0;
                updatePrefix();
                spinner.setText('waiting...');
            };
            clear();
            spinners.unshift({
                clear,
                setPrefix(_current, _prefix) {
                    current = _current;
                    prefix = _prefix;
                    spinner.setText(prefix);
                    updatePrefix();
                },
                tick(msg) {
                    if (prefix) {
                        msg = `${prefix}: ${msg}`;
                    }
                    spinner.setText(msg);
                },
                end() {
                    spinner.stop();
                    reporterSpinners.delete(spinner);
                },
            });
        }
        return {
            spinners,
            end: () => {
                for (const spinner of spinners) {
                    spinner.end();
                }
                readline.moveCursor(this.stdout, 0, -workers + 1);
            },
        };
    }
    activity() {
        if (!this.isTTY) {
            return {
                tick() { },
                end() { },
            };
        }
        const reporterSpinners = this._spinners;
        const spinner = new Spinner(this.stderr);
        spinner.start();
        reporterSpinners.add(spinner);
        return {
            tick(name) {
                spinner.setText(name);
            },
            end() {
                spinner.stop();
                reporterSpinners.delete(spinner);
            },
        };
    }
    select(header, question, options) {
        if (!this.isTTY) {
            return Promise.reject(new Error("Can't answer a question unless a user TTY"));
        }
        const rl = readline.createInterface({
            input: this.stdin,
            output: this.stdout,
            terminal: true,
        });
        const questions = options.map((opt) => opt.name);
        const answers = options.map((opt) => opt.value);
        function toIndex(input) {
            const index = answers.indexOf(input);
            if (index >= 0) {
                return index;
            }
            else {
                return +input;
            }
        }
        return new Promise(resolve => {
            this.info(header);
            for (let i = 0; i < questions.length; i++) {
                this.log(`  ${this.format.dim(`${i + 1})`)} ${questions[i]}`);
            }
            const ask = () => {
                rl.question(`${question}: `, input => {
                    let index = toIndex(input);
                    if (isNaN(index)) {
                        this.log('Not a number');
                        ask();
                        return;
                    }
                    if (index <= 0 || index > options.length) {
                        this.log('Outside answer range');
                        ask();
                        return;
                    }
                    // get index
                    index--;
                    rl.close();
                    resolve(answers[index]);
                });
            };
            ask();
        });
    }
    progress(count) {
        if (this.noProgress || count <= 0) {
            return function () {
                // noop
            };
        }
        if (!this.isTTY) {
            return function () {
                // TODO what should the behaviour here be? we could buffer progress messages maybe
            };
        }
        // Clear any potentially old progress bars
        this.stopProgress();
        const bar = (this._progressBar = new Progress(count, this.stderr, (progress) => {
            if (progress === this._progressBar) {
                this._progressBar = null;
            }
        }));
        bar.render();
        return function () {
            bar.tick();
        };
    }
    stopProgress() {
        if (this._progressBar) {
            this._progressBar.stop();
        }
    }
    async prompt(message, choices, options = {}) {
        if (!process.stdout.isTTY) {
            return Promise.reject(new Error("Can't answer a question unless a user TTY"));
        }
        let pageSize;
        if (process.stdout instanceof tty.WriteStream) {
            pageSize = process.stdout.rows - 2;
        }
        const rl = readline.createInterface({
            input: this.stdin,
            output: this.stdout,
            terminal: true,
        });
        // $FlowFixMe: Need to update the type of Inquirer
        const prompt = inquirer.createPromptModule({
            input: this.stdin,
            output: this.stdout,
        });
        const { name = 'prompt', type = 'input', validate } = options;
        const answers = await prompt([{ name, type, message, choices, pageSize, validate, default: options.default }]);
        rl.close();
        return answers[name];
    }
}
