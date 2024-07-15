import { LoggerService, Injectable, Scope } from '@nestjs/common';
import { Request } from 'express';
import { Logger } from 'log4js';
import { basename } from 'path';

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLogger implements LoggerService {
  constructor(private readonly logger: Logger) {}

  setRequestInfo(req: Request) {
    this.logger.addContext('ip', req.ip);
    this.logger.addContext('method', req.method);
    this.logger.addContext('uri', req.url);
  }

  log(message: any, context?: string) {
    this.setStack(this.log);
    this.logger.log(message, context? context : '');
  }

  error(message: any, trace?: string, context?: string) {
    this.setStack(this.error);
    this.logger.error(message, trace? trace : '', context? context : '');
  }

  warn(message: any, context?: string) {
    this.setStack(this.warn);
    this.logger.warn(message, context? context : '');
  }

  debug?(message: any, context?: string) {
    this.setStack(this.debug);
    this.logger.debug(message, context? context : '');
  }

  private setStack(caller?: Function) {
    const stack = this.getTrace(caller);
    this.logger.addContext('file', stack.file);
    this.logger.addContext('line', stack.line);
    this.logger.addContext('column', stack.column);
    this.logger.addContext('function', stack.func);
  }

  private prepareStackTrace(error: Error, structuredStackTrace: NodeJS.CallSite[]) {
    const trace = structuredStackTrace[0];
    return {
      func: trace.getMethodName() || trace.getFunctionName() || '<anonymous>',
      file: basename(trace.getFileName() || ''),
      line: trace.getLineNumber(),
      column: trace.getColumnNumber()
    }
  }

  private getTrace(caller?: Function) {
    const original = Error.prepareStackTrace;
    const error = {
      stack: {
        func: '',
        file: '',
        line: 0,
        column: 0
      }
    };
    Error.captureStackTrace(error, caller || this.getTrace);
    Error.prepareStackTrace = this.prepareStackTrace;
    const stack = error.stack;
    Error.prepareStackTrace = original;
    return stack;
  }
}
