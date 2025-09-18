import { Request, Response, NextFunction } from "express";
import { JWT } from "@/types";
import { getUserAccess } from "@/modules/auth/services/auth.services";
export interface AuthRequest extends Request {
  user?: JWT;
}

export const permission = (permission: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userAccess = await getUserAccess(req.user.userId!);

    const accessCodes = userAccess.map((a) => a.code);

    if (!accessCodes.includes(permission)) {
      return res.status(403).json({ message: "Insufficient rights" });
    }
    next();
  };
};
