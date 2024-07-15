import { Module } from '@nestjs/common';
import { configure, getLogger } from 'log4js';
import { CustomLogger } from './logger.service';
import * as path from 'path';

const config = {
  'appenders': {
    'access': {
      'type': 'file',
      'filename': path.join(__dirname, 'log/trace.log'),
      'maxLogSize': 10485760,
      'category': 'access',
      'layout': {
        'type': 'pattern',
        'pattern': '[%d{yyyy/MM/dd hh.mm.ss.SSS}],[%p],[%X{ip}],[%X{method} %X{uri}],[%X{file} %X{line}:%X{column} %X{function}],%m'
      }
    },
    //'console': {
    //  'type': 'stdout',
    //  'layout': {
    //    'type': 'pattern',
    //    'pattern': '[%d{yyyy/MM/dd hh.mm.ss.SSS}],[%p],[%X{ip}],[%X{method} %X{uri}],[%X{file} %X{line}:%X{column} %X{function}],%m'
    //  }
    //}
  },
  'categories': {
    'default': {
      //'appenders': ['access', 'console'],
      'appenders': ['access'],
      'level': 'INFO'
    }
  }
}

const loggerFactory = {
  provide: CustomLogger,
  useFactory: () => {
    configure(config);
    return new CustomLogger(getLogger('default'));
  }
}

@Module({
  providers: [loggerFactory],
  exports: [loggerFactory]
})
export class LoggerModule {}
