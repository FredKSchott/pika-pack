import { MessageError } from '@pika/types';
export class ProcessSpawnError extends MessageError {
    constructor(msg, code, process) {
        super(msg);
        this.code = code;
        this.process = process;
    }
}
export class SecurityError extends MessageError {
}
export class ProcessTermError extends MessageError {
}
export class ResponseError extends Error {
    constructor(msg, responseCode) {
        super(msg);
        this.responseCode = responseCode;
    }
}
export class OneTimePasswordError extends Error {
}
