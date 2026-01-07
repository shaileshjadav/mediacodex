import { getAuth } from '@clerk/express'
import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../../config/constants';

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
    const { isAuthenticated, userId } = getAuth(req);
    if(!isAuthenticated){
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
            success:false,
            message:"Unauthorized",
        })
    }
    next();
};

export default authMiddleware;
