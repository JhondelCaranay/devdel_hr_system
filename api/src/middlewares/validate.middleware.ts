import { ZodSchema, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    if (result.error instanceof ZodError) {
      return res.status(400).json(result.error.flatten().fieldErrors);
    }
  }

  // override body with parsed + validated data
  req.body = result.data;
  next();
};

type Schemas<B = any, Q = any, P = any> = {
  body?: ZodSchema<B>;
  query?: ZodSchema<Q>;
  params?: ZodSchema<P>;
};

export const validator =
  <B = any, Q = any, P = any>(schemas: Schemas<B, Q, P>) =>
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
        req.query = result.data;
      }

      // validate params if schema provided
      if (schemas.params) {
        const result = schemas.params.safeParse(req.params);
        if (!result.success) {
          return res.status(400).json(result.error.flatten().fieldErrors);
        }
        req.params = result.data;
      }
      console.log("Unexpected validation error:");
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        console.log("Zod validation error:", err);

        return res.status(400).json(err.flatten().fieldErrors);
      }
      console.log("Unexpected validation error:", err);
      next(err);
    }
  };
