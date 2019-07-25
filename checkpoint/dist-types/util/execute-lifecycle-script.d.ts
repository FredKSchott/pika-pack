/// <reference types="node" />
export declare type LifecycleReturn = Promise<{
    cwd: string;
    command: string;
    stdout: string;
}>;
export declare function makeEnv(): Promise<{
    [key: string]: string;
}>;
export declare function executeLifecycleScript({ cwd, cmd, args, isInteractive, onProgress, customShell, }: {
    cwd: string;
    args: string[];
    cmd: string;
    isInteractive?: boolean;
    onProgress?: (chunk: Buffer | string) => void;
    customShell?: string;
}): LifecycleReturn;
export default executeLifecycleScript;
