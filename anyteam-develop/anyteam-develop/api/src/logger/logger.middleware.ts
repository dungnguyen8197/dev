import { NestMiddleware, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomLogger } from './logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private logger: CustomLogger) {}

  use(req: Request, res: Response, next: Function) {
    this.logger.setRequestInfo(req);
    next();
  }
}