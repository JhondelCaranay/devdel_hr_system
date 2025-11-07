"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareTokens = exports.generateDecodedRefreshToken = exports.generateDecodedToken = exports.setJwtCookies = exports.generateTokens = exports.setJwtCookie = exports.refreshToken = exports.accessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("@/config/env");
const accessToken = async (userId, username) => {
    return jsonwebtoken_1.default.sign({ userId, username }, env_1.ENV.JWT_SECRET, {
        expiresIn: "1h",
    });
};
exports.accessToken = accessToken;
const refreshToken = async (userId, username) => {
    return jsonwebtoken_1.default.sign({ userId, username }, env_1.ENV.JWT_REFRESH_SECRET, {
        expiresIn: "7d",
    });
};
exports.refreshToken = refreshToken;
const generateTokens = async (userId, username) => {
    const access = await accessToken(userId, username);
    const refresh = await refreshToken(userId, username);
    return { access, refresh };
};
exports.generateTokens = generateTokens;
const setJwtCookie = (res, key, token, age) => {
    res.cookie(key, token, {
        httpOnly: true,
        secure: env_1.ENV.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: age, // in milliseconds
    });
};
exports.setJwtCookie = setJwtCookie;
const setJwtCookies = (res, accessToken, refreshToken) => {
    // 1 day = 24 * 60 * 60 * 1000 ms
    setJwtCookie(res, "accessToken", accessToken, 24 * 60 * 60 * 1000);
    // 7 days = 7 * 24 * 60 * 60 * 1000 ms
    setJwtCookie(res, "refreshToken", refreshToken, 7 * 24 * 60 * 60 * 1000);
};
exports.setJwtCookies = setJwtCookies;
// const setJwtCookies = (res: Response, accessToken: string, refreshToken: string): void => {
//   setJwtCookie(res, "accessToken", accessToken, 20 * 1000);
//   setJwtCookie(res, "refreshToken", refreshToken, 30 * 1000);
// };
const generateDecodedToken = async (token) => {
    const decoded = jsonwebtoken_1.default.verify(token, env_1.ENV.JWT_SECRET);
    return decoded;
};
exports.generateDecodedToken = generateDecodedToken;
const generateDecodedRefreshToken = async (token) => {
    const decoded = jsonwebtoken_1.default.verify(token, env_1.ENV.JWT_REFRESH_SECRET);
    return decoded;
};
exports.generateDecodedRefreshToken = generateDecodedRefreshToken;
const compareTokens = async (token1, token2) => {
    return token1 === token2;
};
exports.compareTokens = compareTokens;
