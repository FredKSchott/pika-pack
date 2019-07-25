import BaseReporter from './base-reporter.js';
import { LanguageKeys } from './lang/en.js';
import { Package, ReporterSpinner, ReporterSpinnerSet, Trees } from './types.js';
export default class NoopReporter extends BaseReporter {
    lang(key: LanguageKeys, ...args: Array<any>): string;
    verbose(msg: string): void;
    verboseInspect(val: any): void;
    initPeakMemoryCounter(): void;
    checkPeakMemory(): void;
    close(): void;
    getTotalTime(): number;
    list(key: string, items: Array<string>, hints?: Object): void;
    tree(key: string, obj: Trees): void;
    step(current: number, total: number, message: string, emoji?: string): void;
    error(message: string): void;
    info(message: string): void;
    warn(message: string): void;
    success(message: string): void;
    log(message: string): void;
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
