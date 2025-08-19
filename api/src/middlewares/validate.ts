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
