/// <reference types="node" />
import { Writable, Readable } from 'stream';
import { WriteStream, ReadStream } from 'fs';
export declare type Stdout = Writable | WriteStream;
export declare type Stdin = Readable | ReadStream;
export declare type Package = {
    name: string;
    version: string;
};
export declare type Tree = {
    name: string;
    children?: Trees;
    hint?: string;
    hidden?: boolean;
    color?: string;
};
export declare type Trees = Array<Tree>;
export declare type ReporterSpinner = {
    tick: (name: string) => void;
    end: () => void;
};
export declare type ReporterSpinnerSet = {
    spinners: Array<ReporterSetSpinner>;
    end: () => void;
};
export declare type ReporterSetSpinner = {
    clear: () => void;
    setPrefix: (current: number, prefix: string) => void;
    tick: (msg: string) => void;
    end: () => void;
};
