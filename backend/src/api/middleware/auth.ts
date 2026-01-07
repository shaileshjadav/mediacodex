import { getAuth } from '@clerk/express'
import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../../config/constants';

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    const { isAuthenticated, userId } = getAuth(req);
    if(!isAuthenticated){
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            success:false,
            message:"Unauthorized",
        })
    }
    next();
};

export default authMiddleware;
