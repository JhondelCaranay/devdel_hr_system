import { JwtPayload } from "jsonwebtoken";

export type JWT = {
  userId?: number;
  username?: string;
  iat?: number;
  exp?: number;
};

declare module "express-serve-static-core" {
  interface Request {
    user?: JWT;
  }
}
