import { Trees } from '../../types.js';
export declare type FormattedOutput = {
    prefix: string;
    hint: any;
    color: string;
    name: string;
    formatter: any;
};
export declare function sortTrees(trees: Trees): Trees;
export declare function recurseTree(tree: Trees, prefix: string, recurseFunc: Function): void;
export declare function getFormattedOutput(fmt: FormattedOutput): string;
