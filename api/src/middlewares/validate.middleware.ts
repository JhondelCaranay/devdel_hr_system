import { ZodSchema, ZodError, ZodTypeAny } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
  <T extends ZodTypeAny>(schema: T) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (!result.success) {
        return res.status(400).json(result.error.flatten().fieldErrors);
      }

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json(err.flatten().fieldErrors);
      }
      next(err);
    }
  };

type Schemas<B = any, Q = any, P = any> = {
  body?: ZodSchema<B>;
  query?: ZodSchema<Q>;
  params?: ZodSchema<P>;
};

export const validator =
  <B extends object = any, Q extends object = any, P extends object = any>(schemas: Schemas<B, Q, P>) =>
  (req: Request<P, any, B, Q>, res: Response, next: NextFunction) => {
    try {
      // validate body if schema provided
      if (schemas.body) {
        const result = schemas.body.safeParse(req.body);
        if (!result.success) {
          return res.status(400).json(result.error.flatten().fieldErrors);
        }
        req.body = result.data;
      }

      // validate query if schema provided
      if (schemas.query) {
        const result = schemas.query.safeParse(req.query);
        if (!result.success) {
          return res.status(400).json(result.error.flatten().fieldErrors);
        }
        Object.assign(req.query, result.data);
      }

      // validate params if schema provided
      if (schemas.params) {
        const result = schemas.params.safeParse(req.params);
        if (!result.success) {
          return res.status(400).json(result.error.flatten().fieldErrors);
        }
        Object.assign(req.params, result.data);
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json(err.flatten().fieldErrors);
      }
      next(err);
    }
  };
