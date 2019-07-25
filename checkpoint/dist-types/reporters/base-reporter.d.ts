/// <reference types="node" />
import { ReporterSpinnerSet, Trees, Stdout, Stdin, Package, ReporterSpinner } from './types';
import { LanguageKeys } from './lang/en.js';
import { Formatter } from './format.js';
import * as languages from './lang/index.js';
declare type Language = keyof typeof languages;
export declare type ReporterOptions = {
    verbose?: boolean;
    language?: Language;
    stdout?: Stdout;
    stderr?: Stdout;
    stdin?: Stdin;
    emoji?: boolean;
    noProgress?: boolean;
    silent?: boolean;
    isSilent?: boolean;
    nonInteractive?: boolean;
};
export declare function stringifyLangArgs(args: Array<any>): Array<string>;
export default class BaseReporter {
    constructor(opts?: ReporterOptions);
    formatter: Formatter;
    language: Language;
    stdout: Stdout;
    stderr: Stdout;
    stdin: Stdin;
    isTTY: boolean;
    emoji: boolean;
    noProgress: boolean;
    isVerbose: boolean;
    isSilent: boolean;
    nonInteractive: boolean;
    format: Formatter;
    peakMemoryInterval?: NodeJS.Timer;
    peakMemory: number;
    startTime: number;
    lang(key: LanguageKeys, ...args: Array<any>): string;
    /**
     * `stringifyLangArgs` run `JSON.stringify` on strings too causing
     * them to appear quoted. This marks them as "raw" and prevents
     * the quoting and escaping
     */
    rawText(str: string): {
        inspect(): string;
    };
    verbose(msg: string): void;
    verboseInspect(val: any): void;
    _verbose(msg: string): void;
    _verboseInspect(val: any): void;
    _getStandardInput(): Stdin;
    initPeakMemoryCounter(): void;
    checkPeakMemory(): void;
    close(): void;
    getTotalTime(): number;
    list(key: string, items: Array<string>, hints?: Object): void;
    tree(key: string, obj: Trees, { force }?: {
        force?: boolean;
    }): void;
    step(current: number, total: number, message: string, emoji?: string): void;
    error(message: string): void;
    info(message: string): void;
    warn(message: string): void;
    success(message: string): void;
    log(message: string, { force }?: {
        force?: boolean;
    }): void;
    command(command: string): void;
    inspect(value: any): void;
    header(pkg: Package): void;
    footer(showPeakMemory: boolean): void;
    table(head: Array<string>, body: Array<Array<string>>): void;
    activity(): ReporterSpinner;
    activitySet(total: number, workers: number): ReporterSpinnerSet;
    progress(total: number): () => void;
    disableProgress(): void;
}
export {};
