/// <reference types="node" />
import { Stdout } from '../types.js';
export default class ProgressBar {
    constructor(total: number, stdout?: Stdout, callback?: (progressBar: ProgressBar) => void);
    stdout: Stdout;
    curr: number;
    total: number;
    width: number;
    chars: [string, string];
    delay: number;
    id?: NodeJS.Timeout;
    _callback?: (progressBar: ProgressBar) => void;
    static bars: [string, string][];
    tick(): void;
    cancelTick(): void;
    stop(): void;
    render(): void;
}
