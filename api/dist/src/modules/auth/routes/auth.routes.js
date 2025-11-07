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
const express_1 = require("express");
const authController = __importStar(require("./../controllers/auth.controllers"));
const validate_middleware_1 = require("@/middlewares/validate.middleware");
const auth_validators_1 = require("../validators/auth.validators");
const auth_middleware_1 = require("@/middlewares/auth.middleware");
const permission_middleware_1 = require("@/middlewares/permission.middleware");
const router = (0, express_1.Router)();
router.post("/register", (0, validate_middleware_1.validator)({
    body: auth_validators_1.registerSchema,
}), authController.register);
router.post("/login", (0, validate_middleware_1.validator)({
    body: auth_validators_1.loginSchema,
}), authController.login);
router.post("/logout", auth_middleware_1.authenticate, authController.logout);
router.post("/refresh-token", auth_middleware_1.authenticateRefreshToken, authController.refreshToken);
router.get("/me", auth_middleware_1.authenticate, (0, permission_middleware_1.permission)("post:create_post"), authController.getMe);
router.get("/my-permissions", auth_middleware_1.authenticate, authController.getMyAccess);
exports.default = router;
