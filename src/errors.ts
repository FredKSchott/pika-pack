import {MessageError} from '@pika/types';

export class ProcessSpawnError extends MessageError {
  constructor(msg: string, code?: string, process?: string) {
    super(msg);
    this.code = code;
    this.process = process;
  }

  code?: string;
  process?: string;
}

export class SecurityError extends MessageError {}

export class ProcessTermError extends MessageError {
  EXIT_CODE?: number;
  EXIT_SIGNAL?: string;
}

export class ResponseError extends Error {
  constructor(msg: string, responseCode: number) {
    super(msg);
    this.responseCode = responseCode;
  }

  responseCode: number;
}

export class OneTimePasswordError extends Error {}
