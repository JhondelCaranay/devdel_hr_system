"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyRoleAccessSchema = exports.storeRoleSchema = exports.rolesPaginatedSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.rolesPaginatedSchema = zod_1.default.object({
    query: zod_1.default.object({
        page: zod_1.default.coerce.number("page must be a number").optional(),
        search: zod_1.default.string().optional(),
        limit: zod_1.default.coerce.number("limit must be a numbe").optional(),
    }),
});
exports.storeRoleSchema = zod_1.default.object({
    body: zod_1.default.object({
        name: zod_1.default
            .string("Name is required")
            .min(1, "Name must be at least 1 character")
            .max(50, "Name must be at most 50 characters"),
        description: zod_1.default.string().max(255, "Description must be at most 255 characters").optional(),
    }),
});
exports.copyRoleAccessSchema = zod_1.default.object({
    body: zod_1.default.object({
        copy_from_uuid: zod_1.default.string("copy_from_uuid is required"),
    }),
});
