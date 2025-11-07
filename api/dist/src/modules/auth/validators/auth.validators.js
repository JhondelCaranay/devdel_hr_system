"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = exports.loginSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.loginSchema = zod_1.default.object({
    username: zod_1.default.string().min(1, "Username is required"),
    password: zod_1.default.string().min(6, "Password must be at least 6 characters long"),
});
exports.registerSchema = zod_1.default.object({
    username: zod_1.default.string().min(1, "Username is required"),
    password: zod_1.default.string().min(6, "Password must be at least 6 characters long"),
    email: zod_1.default.email("Invalid email address"),
    first_name: zod_1.default.string().min(1, "First name is required"),
    last_name: zod_1.default.string().min(1, "Last name is required"),
});
