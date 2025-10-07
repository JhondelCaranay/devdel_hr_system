import { Request, Response, NextFunction } from "express";
import { JWT } from "@/types";
import { getUserAccess } from "@/modules/auth/services/auth.services";
export interface AuthRequest extends Request {
  user?: JWT;
}

// ✅ Single permission check
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

// ✅ Must have ALL permissions
export const hasAllPermission = (permissions: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userAccess = await getUserAccess(req.user.userId!);
    const accessCodes = userAccess.map((a) => a.code);

    const hasAll = permissions.every((perm) => accessCodes.includes(perm));
    if (!hasAll) {
      return res.status(403).json({ message: "Insufficient rights" });
    }

    next();
  };
};

// ✅ Must have AT LEAST ONE permission
export const hasAnyPermission = (permissions: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userAccess = await getUserAccess(req.user.userId!);
    const accessCodes = userAccess.map((a) => a.code);

    const hasAny = permissions.some((perm) => accessCodes.includes(perm));
    if (!hasAny) {
      return res.status(403).json({ message: "Insufficient rights" });
    }

    next();
  };
};
