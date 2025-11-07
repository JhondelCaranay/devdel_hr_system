"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateRefreshToken = exports.authenticate = void 0;
const jwt_1 = require("@/utils/jwt");
const authenticate = async (req, res, next) => {
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
        // const comparedTokens = await compareTokens(token, accessToken);
        // if (!comparedTokens) {
        //   return res.status(401).json({ message: "Token mismatch" });
        // }
        const decoded = await (0, jwt_1.generateDecodedToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
exports.authenticate = authenticate;
const authenticateRefreshToken = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: "Expired refresh token" });
    }
    const decoded = await (0, jwt_1.generateDecodedRefreshToken)(refreshToken);
    req.user = decoded;
    next();
};
exports.authenticateRefreshToken = authenticateRefreshToken;
