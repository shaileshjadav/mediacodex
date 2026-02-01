import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { HTTP_STATUS } from "../../config/constants";

interface ValidationSchemas {
  body?: z.ZodSchema;
  query?: z.ZodSchema;
  params?: z.ZodSchema;
}

export const validate = (schemas: ValidationSchemas) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: { field: string; message: string; source: string }[] = [];

    // Validate body
    if (schemas.body) {
      try {
        schemas.body.parse(req.body);
      } catch (error) {
        if (error instanceof ZodError) {
          errors.push(...error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
            source: 'body'
          })));
        }
      }
    }

    // Validate query
    if (schemas.query) {
      try {
        schemas.query.parse(req.query);
      } catch (error) {
        if (error instanceof ZodError) {
          errors.push(...error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
            source: 'query'
          })));
        }
      }
    }

    // Validate params
    if (schemas.params) {
      try {
        schemas.params.parse(req.params);
      } catch (error) {
        if (error instanceof ZodError) {
          errors.push(...error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
            source: 'params'
          })));
        }
      }
    }

    if (errors.length > 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: 'Validation failed',
        details: errors
      });
    }

    next();
  };
};