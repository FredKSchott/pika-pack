import { MessageError } from '@pika/types';
export declare class ProcessSpawnError extends MessageError {
    constructor(msg: string, code?: string, process?: string);
    code?: string;
    process?: string;
}
export declare class SecurityError extends MessageError {
}
export declare class ProcessTermError extends MessageError {
    EXIT_CODE?: number;
    EXIT_SIGNAL?: string;
}
export declare class ResponseError extends Error {
    constructor(msg: string, responseCode: number);
    responseCode: number;
}
export declare class OneTimePasswordError extends Error {
}
