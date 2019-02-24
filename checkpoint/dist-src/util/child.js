/* global child_process$spawnOpts */
import * as constants from '../constants.js';
import BlockingQueue from './blocking-queue.js';
import { ProcessSpawnError, ProcessTermError } from '../errors.js';
import { promisify } from './promise.js';
import { exec as _exec, spawn as _spawn } from 'child_process';
export const queue = new BlockingQueue('child', constants.CHILD_CONCURRENCY);
// TODO: this uid check is kinda whack
let uid = 0;
export const exec = promisify(_exec);
const spawnedProcesses = {};
export function forwardSignalToSpawnedProcesses(signal) {
    for (const key of Object.keys(spawnedProcesses)) {
        spawnedProcesses[key].kill(signal);
    }
}
export function spawn(program, args, opts = {}, onData) {
    const key = opts.cwd || String(++uid);
    return queue.push(key, () => new Promise((resolve, reject) => {
        const proc = _spawn(program, args, opts);
        spawnedProcesses[key] = proc;
        let processingDone = false;
        let processClosed = false;
        let err = null;
        let stdout = '';
        proc.on('error', (err) => {
            if (err.code === 'ENOENT') {
                reject(new ProcessSpawnError(`Couldn't find the binary ${program}`, err.code, program));
            }
            else {
                reject(err);
            }
        });
        function updateStdout(chunk) {
            stdout += chunk;
            if (onData) {
                onData(chunk);
            }
        }
        function finish() {
            delete spawnedProcesses[key];
            if (err) {
                reject(err);
            }
            else {
                resolve(stdout.trim());
            }
        }
        if (typeof opts.process === 'function') {
            opts.process(proc, updateStdout, reject, function () {
                if (processClosed) {
                    finish();
                }
                else {
                    processingDone = true;
                }
            });
        }
        else {
            if (proc.stderr) {
                proc.stderr.on('data', updateStdout);
            }
            if (proc.stdout) {
                proc.stdout.on('data', updateStdout);
            }
            processingDone = true;
        }
        proc.on('close', (code, signal) => {
            if (signal || code >= 1) {
                err = new ProcessTermError([
                    'Command failed.',
                    signal ? `Exit signal: ${signal}` : `Exit code: ${code}`,
                    `Command: ${program}`,
                    `Arguments: ${args.join(' ')}`,
                    `Directory: ${opts.cwd || process.cwd()}`,
                    `Output:\n${stdout.trim()}`,
                ].join('\n'));
                err.EXIT_SIGNAL = signal;
                err.EXIT_CODE = code;
            }
            if (processingDone || err) {
                finish();
            }
            else {
                processClosed = true;
            }
        });
    }));
}
