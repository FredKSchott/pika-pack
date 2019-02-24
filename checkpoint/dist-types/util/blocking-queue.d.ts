/// <reference types="node" />
export default class BlockingQueue {
    constructor(alias: string, maxConcurrency?: number);
    concurrencyQueue: Array<() => void>;
    warnedStuck: boolean;
    maxConcurrency: number;
    runningCount: number;
    stuckTimer?: NodeJS.Timeout;
    alias: string;
    first: boolean;
    queue: {
        [key: string]: Array<{
            factory: () => Promise<any>;
            resolve: (val: any) => void;
            reject: Function;
        }>;
    };
    running: {
        [key: string]: boolean;
    };
    stillActive(): void;
    stuckTick(): void;
    push<T>(key: string, factory: () => Promise<T>): Promise<T>;
    shift(key: string): void;
    maybePushConcurrencyQueue(run: () => void): void;
    shiftConcurrencyQueue(): void;
}
