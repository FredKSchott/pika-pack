/// <reference types="node" />
import { Stdout } from '../types.js';
export default class Spinner {
    constructor(stdout?: Stdout, lineNumber?: number);
    stdout: Stdout;
    prefix: string;
    current: number;
    lineNumber: number;
    delay: number;
    chars: Array<string>;
    text: string;
    id?: NodeJS.Timeout;
    static spinners: Array<string>;
    setPrefix(prefix: string): void;
    setText(text: string): void;
    start(): void;
    render(): void;
    stop(): void;
}
