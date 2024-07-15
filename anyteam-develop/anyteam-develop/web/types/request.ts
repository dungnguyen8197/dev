import { Request } from 'express';
import { SupportInfo } from '../assets/types/support/info';

export interface CustomRequest extends Request {
  session: {
    token: string;
    supportInfo?: SupportInfo;
  },
  file: Express.Multer.File;
  files: Express.Multer.File[];
}