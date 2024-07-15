import { CustomRequest } from '../types/request';
import { NextFunction, Response } from 'express';

module.exports = {
  checkAuth: (req: CustomRequest, res: Response, next: NextFunction) => {
    if (req.session.token) return next();
    return res.redirect('/user/login');
  },
  checkNotAuth: (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.session.token) return next();
    return res.redirect('/user');
  }
}