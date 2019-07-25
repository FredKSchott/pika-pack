import BaseReporter, { ReporterOptions } from '../base-reporter.js';
import { FormatKeys } from '../format.js';
import { Package, ReporterSpinner, ReporterSpinnerSet, Trees } from '../types.js';
import Progress from './progress-bar.js';
import Spinner from './spinner-progress.js';
declare type Row = Array<string>;
export default class ConsoleReporter extends BaseReporter {
    _lastCategorySize: number;
    _progressBar?: Progress;
    _spinners: Set<Spinner>;
    constructor(opts: ReporterOptions);
    _prependEmoji(msg: string, emoji?: string): string;
    _logCategory(category: string, color: FormatKeys, msg: string): void;
    _verbose(msg: string): void;
    _verboseInspect(obj: any): void;
    close(): void;
    table(head: Array<string>, body: Array<Row>): void;
    step(current: number, total: number, msg: string, emoji?: string): void;
    inspect(value: any): void;
    list(key: string, items: Array<string>, hints?: Object): void;
    header(pkg: Package): void;
    footer(showPeakMemory?: boolean): void;
    log(msg: string, { force }?: {
        force?: boolean;
    }): void;
    _log(msg: string, { force }?: {
        force?: boolean;
    }): void;
    success(msg: string): void;
    error(msg: string): void;
    info(msg: string): void;
    command(command: string): void;
    warn(msg: string): void;
    tree(key: string, trees: Trees, { force }?: {
        force?: boolean;
    }): void;
    activitySet(total: number, workers: number): ReporterSpinnerSet;
    activity(): ReporterSpinner;
    progress(count: number): () => void;
    stopProgress(): void;
}
export {};
