"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAccesschema = exports.storeAccesschema = exports.accessPaginatedSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.accessPaginatedSchema = zod_1.default.object({
    query: zod_1.default.object({
        page: zod_1.default.coerce.number("page must be a number").optional(),
        search: zod_1.default.string().optional(),
        limit: zod_1.default.coerce.number("limit must be a numbe").optional(),
    }),
});
exports.storeAccesschema = zod_1.default.object({
    body: zod_1.default.object({
        code: zod_1.default
            .string("Code is required")
            .min(1, "Code must be at least 1 character")
            .max(50, "Code must be at most 50 characters"),
        label: zod_1.default
            .string("Label is required")
            .min(1, "Label must be at least 1 character")
            .max(100, "Label must be at most 100 characters"),
        module_id: zod_1.default.number("Module ID must be a number").int("Module ID must be an integer"),
    }),
});
exports.updateAccesschema = zod_1.default.object({
    body: zod_1.default.object({
        code: zod_1.default.string("Code is required").optional(),
        label: zod_1.default.string("Label is required").optional(),
        module_id: zod_1.default.number("Module ID must be a number").optional(),
    }),
});
