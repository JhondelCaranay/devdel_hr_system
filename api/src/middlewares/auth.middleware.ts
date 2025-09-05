import { JWT } from "@/types";
import { compareTokens, generateDecodedToken } from "@/utils/jwt";
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

    const comparedTokens = await compareTokens(token, accessToken);

    if (!comparedTokens) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return res.status(401).json({ message: "Token mismatch" });
    }

    const decoded = await generateDecodedToken(token);
    req.user = decoded as JWT;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
