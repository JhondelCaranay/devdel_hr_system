import jwt from "jsonwebtoken";
import { Response } from "express";
import { ENV } from "@/config/env";

const accessToken = async (userId: number, username: string): Promise<string> => {
  return jwt.sign({ userId, username }, ENV.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const refreshToken = async (userId: number, username: string): Promise<string> => {
  return jwt.sign({ userId, username }, ENV.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

const generateTokens = async (userId: number, username: string): Promise<{ access: string; refresh: string }> => {
  const access = await accessToken(userId, username);
  const refresh = await refreshToken(userId, username);
  return { access, refresh };
};

const setJwtCookie = (res: Response, key: string, token: string, age: number): void => {
  res.cookie(key, token, {
    httpOnly: true,
    secure: ENV.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: age, // in milliseconds
  });
};

// const setJwtCookies = (res: Response, accessToken: string, refreshToken: string): void => {
//   // 1 day = 24 * 60 * 60 * 1000 ms
//   setJwtCookie(res, "accessToken", accessToken, 24 * 60 * 60 * 1000);

//   // 7 days = 7 * 24 * 60 * 60 * 1000 ms
//   setJwtCookie(res, "refreshToken", refreshToken, 7 * 24 * 60 * 60 * 1000);
// };

const setJwtCookies = (res: Response, accessToken: string, refreshToken: string): void => {
  // 1 minute = 60 * 1000 ms
  setJwtCookie(res, "accessToken", accessToken, 20 * 1000);

  // 2 minutes = 2 * 60 * 1000 ms
  setJwtCookie(res, "refreshToken", refreshToken, 30 * 1000);
};

const generateDecodedToken = async (token: string) => {
  const decoded = jwt.verify(token, ENV.JWT_SECRET);
  return decoded;
};

const generateDecodedRefreshToken = async (token: string) => {
  const decoded = jwt.verify(token, ENV.JWT_REFRESH_SECRET);
  return decoded;
};

const compareTokens = async (token1: string, token2: string): Promise<boolean> => {
  return token1 === token2;
};

export {
  accessToken,
  refreshToken,
  setJwtCookie,
  generateTokens,
  setJwtCookies,
  generateDecodedToken,
  generateDecodedRefreshToken,
  compareTokens,
};
