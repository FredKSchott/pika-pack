/// <reference types="node" />
import Config from '../config.js';
export declare type LifecycleReturn = Promise<{
    cwd: string;
    command: string;
    stdout: string;
}>;
export declare function makeEnv(): Promise<{
    [key: string]: string;
}>;
export declare function executeLifecycleScript({ config, cwd, cmd, isInteractive, onProgress, customShell, }: {
    config: Config;
    cwd: string;
    cmd: string;
    isInteractive?: boolean;
    onProgress?: (chunk: Buffer | string) => void;
    customShell?: string;
}): LifecycleReturn;
export default executeLifecycleScript;
export declare function execCommand({ stage, config, cmd, cwd, isInteractive, customShell, }: {
    stage: string;
    config: Config;
    cmd: string;
    cwd: string;
    isInteractive: boolean;
    customShell?: string;
}): Promise<void>;
