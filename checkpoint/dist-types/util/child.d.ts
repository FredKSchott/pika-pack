/// <reference types="node" />
import BlockingQueue from './blocking-queue.js';
import { ChildProcess, SpawnOptions } from 'child_process';
export declare const queue: BlockingQueue;
export declare const exec: (...args: any[]) => Promise<any>;
export declare function forwardSignalToSpawnedProcesses(signal: string): void;
declare type ProcessFn = (proc: ChildProcess, update: (chunk: string) => void, reject: (err: any) => void, done: () => void) => void;
export declare function spawn(program: string, args: Array<string>, opts?: SpawnOptions & {
    detached?: boolean;
    process?: ProcessFn;
}, onData?: (chunk: Buffer | string) => void): Promise<string>;
export {};
