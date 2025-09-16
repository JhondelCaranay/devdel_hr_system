import { refreshToken } from "./../modules/auth/controllers/auth.controllers";
import { JWT } from "@/types";
import { compareTokens, generateDecodedRefreshToken, generateDecodedToken } from "@/utils/jwt";
import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  user?: JWT;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1]; // Bearer <token>
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({ message: "Expired token" });
    }

    const comparedTokens = await compareTokens(token, accessToken);

    if (!comparedTokens) {
      return res.status(401).json({ message: "Token mismatch" });
    }

    const decoded = await generateDecodedToken(token);
    req.user = decoded as JWT;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const authenticateRefreshToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Expired refresh token" });
  }

  const decoded = await generateDecodedRefreshToken(refreshToken);
  req.user = decoded as JWT;
  next();
};
