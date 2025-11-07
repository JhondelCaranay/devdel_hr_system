"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersPaginatedSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.usersPaginatedSchema = zod_1.default.object({
    // body: z.object({
    //   name: z.string("name is required").min(1, "name should not be empty"),
    // }),
    query: zod_1.default.object({
        page: zod_1.default.coerce.number("page must be a number").optional(),
        search: zod_1.default.string().optional(),
        limit: zod_1.default.coerce.number("limit must be a number").optional(),
        role_uuid: zod_1.default.string().optional(),
    }),
});
// export type IUserPaginatedBodySchema = z.infer<typeof usersPaginatedSchema>["body"];
// export type IUserPaginatedQuerySchema = z.infer<typeof usersPaginatedSchema>["query"];
