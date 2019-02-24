export declare function wait(delay: number): Promise<void>;
export declare function promisify(fn: Function, firstData?: boolean): (...args: Array<any>) => Promise<any>;
export declare function queue<T, U>(arr: Array<U>, promiseProducer: (result: U) => Promise<T>, concurrency?: number): Promise<Array<T>>;
