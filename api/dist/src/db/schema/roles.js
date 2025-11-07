"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleRelations = exports.roles = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const users_1 = require("./users");
const role_access_1 = require("./role_access");
exports.roles = (0, pg_core_1.pgTable)("roles", {
    id: (0, pg_core_1.integer)().primaryKey().generatedAlwaysAsIdentity(),
    uuid: (0, pg_core_1.uuid)().defaultRandom().notNull(),
    name: (0, pg_core_1.varchar)({ length: 255 }).notNull().unique(),
    description: (0, pg_core_1.varchar)({ length: 500 }),
    updated_at: (0, pg_core_1.timestamp)(),
    created_at: (0, pg_core_1.timestamp)().defaultNow().notNull(),
    deleted_at: (0, pg_core_1.timestamp)(),
});
exports.roleRelations = (0, drizzle_orm_1.relations)(exports.roles, ({ many }) => ({
    users: many(users_1.users),
    role_access: many(role_access_1.roleAccess),
}));
