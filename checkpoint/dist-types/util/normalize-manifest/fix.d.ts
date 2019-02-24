import { Reporter } from '../../reporters/index.js';
declare type Dict<T> = {
    [key: string]: T;
};
declare type WarnFunction = (msg: string) => void;
declare const _default: (info: Dict<any>, moduleLoc: string, reporter: Reporter, warn: WarnFunction) => Promise<void>;
export default _default;
