import { ReporterSpinnerSet, Trees, ReporterSpinner } from './types.js';
import BaseReporter from './base-reporter.js';
export default class JSONReporter extends BaseReporter {
    constructor(opts?: Object);
    _activityId: number;
    _progressId: number;
    _dump(type: string, data: any, error?: boolean): void;
    _verbose(msg: string): void;
    list(type: string, items: Array<string>, hints?: Object): void;
    tree(type: string, trees: Trees): void;
    step(current: number, total: number, message: string): void;
    inspect(value: any): void;
    footer(showPeakMemory: boolean): void;
    log(msg: string): void;
    command(msg: string): void;
    table(head: Array<string>, body: Array<Array<string>>): void;
    success(msg: string): void;
    error(msg: string): void;
    warn(msg: string): void;
    info(msg: string): void;
    activitySet(total: number, workers: number): ReporterSpinnerSet;
    activity(): ReporterSpinner;
    _activity(data: Object): ReporterSpinner;
    progress(total: number): () => void;
}
