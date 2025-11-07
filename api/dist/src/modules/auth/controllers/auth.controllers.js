"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyAccess = exports.getMe = exports.refreshToken = exports.logout = exports.login = exports.register = void 0;
const authService = __importStar(require("../services/auth.services"));
const hashPassword_1 = require("@/utils/hashPassword");
const jwt_1 = require("@/utils/jwt");
const register = async (req, res) => {
    const body = req.body;
    const existingUser = await authService.findUserByEmailOrUsername(body.email, body.username);
    if (existingUser) {
        return res.status(400).json({ message: "Email or Username already exists" });
    }
    const role = await authService.findRoleByName("user");
    if (!role) {
        return res.status(400).json({ message: "Default role not found" });
    }
    const newUser = await authService.register({
        ...body,
        role_id: role.id,
    });
    if (!newUser) {
        return res.status(400).json({ message: "Registration failed" });
    }
    const hashedPassword = await (0, hashPassword_1.hashPassword)(body.password);
    await authService.createCredential({
        userId: newUser.id,
        username: body.username,
        password: hashedPassword,
        status: "active",
    });
    return res.status(200).json({ message: "Registration successful" });
};
exports.register = register;
const login = async (req, res) => {
    const body = req.body;
    const existingUser = await authService.findUserByEmailOrUsername(body.username, body.username);
    if (!existingUser) {
        return res.status(400).json({ message: "Invalid credentials" });
    }
    const comparedPassword = await (0, hashPassword_1.comparePassword)(body.password, existingUser.credentials.password);
    if (!comparedPassword) {
        return res.status(400).json({ message: "Invalid credentials" });
    }
    const { access, refresh } = await (0, jwt_1.generateTokens)(existingUser.users.id, existingUser.credentials.username);
    (0, jwt_1.setJwtCookies)(res, access, refresh);
    const permission = await authService.getUserAccess(existingUser.users.id);
    const formattedPermissions = permission.map((perm) => perm.code);
    return res.status(200).json({
        message: "Login successful",
        id: existingUser.users.id,
        username: existingUser.credentials.username,
        email: existingUser.users.email,
        role: existingUser.roles.name,
        accessToken: access,
        permissions: formattedPermissions,
    });
};
exports.login = login;
const logout = async (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "Logout successful" });
};
exports.logout = logout;
const refreshToken = async (req, res) => {
    const userId = req.user?.userId;
    const existingUser = await authService.findUserById(userId);
    if (!existingUser) {
        return res.status(400).json({ message: "User not found" });
    }
    const { access, refresh } = await (0, jwt_1.generateTokens)(existingUser.users.id, existingUser.credentials.username);
    (0, jwt_1.setJwtCookies)(res, access, refresh);
    const permission = await authService.getUserAccess(existingUser.users.id);
    const formattedPermissions = permission.map((perm) => perm.code);
    return res.status(200).json({
        message: "Token refreshed",
        id: existingUser.users.id,
        username: existingUser.credentials.username,
        email: existingUser.users.email,
        role: existingUser.roles.name,
        accessToken: access,
        permissions: formattedPermissions,
    });
};
exports.refreshToken = refreshToken;
const getMe = async (req, res) => {
    const userId = req.user?.userId;
    const existingUser = await authService.findUserById(userId);
    if (!existingUser) {
        return res.status(400).json({ message: "User not found" });
    }
    return res.status(200).json(existingUser.users);
};
exports.getMe = getMe;
const getMyAccess = async (req, res) => {
    const userId = req.user?.userId;
    const access = await authService.getUserAccess(userId);
    return res.status(200).json(access);
};
exports.getMyAccess = getMyAccess;
