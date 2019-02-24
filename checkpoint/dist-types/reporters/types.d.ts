/// <reference types="node" />
import { Writable, Readable } from "stream";
import { WriteStream, ReadStream } from "fs";
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
export declare type ReporterSelectOption = {
    name: string;
    value: string;
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
export declare type QuestionOptions = {
    password?: boolean;
    required?: boolean;
};
export declare type InquirerPromptTypes = 'list' | 'rawlist' | 'expand' | 'checkbox' | 'confirm' | 'input' | 'password' | 'editor';
export declare type PromptOptions = {
    name?: string;
    type?: InquirerPromptTypes;
    default?: string | boolean;
    validate?: (input: string | Array<string>) => boolean | string;
};
