"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRelations = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const roles_1 = require("./roles");
const credentials_1 = require("./credentials");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.integer)().primaryKey().generatedAlwaysAsIdentity(),
    uuid: (0, pg_core_1.uuid)().defaultRandom().notNull(),
    email: (0, pg_core_1.varchar)({ length: 255 }).unique(),
    first_name: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    middle_name: (0, pg_core_1.varchar)({ length: 255 }),
    last_name: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    phone: (0, pg_core_1.varchar)({ length: 20 }),
    address: (0, pg_core_1.varchar)({ length: 255 }),
    city: (0, pg_core_1.varchar)({ length: 100 }),
    province: (0, pg_core_1.varchar)({ length: 100 }),
    country: (0, pg_core_1.varchar)({ length: 100 }),
    zip_code: (0, pg_core_1.varchar)({ length: 20 }),
    role_id: (0, pg_core_1.integer)()
        .notNull()
        .references(() => roles_1.roles.id),
    updated_at: (0, pg_core_1.timestamp)(),
    created_at: (0, pg_core_1.timestamp)().defaultNow().notNull(),
    deleted_at: (0, pg_core_1.timestamp)(),
});
exports.userRelations = (0, drizzle_orm_1.relations)(exports.users, ({ one }) => ({
    credential: one(credentials_1.credentials, { fields: [exports.users.id], references: [credentials_1.credentials.user_id] }),
    role: one(roles_1.roles, { fields: [exports.users.role_id], references: [roles_1.roles.id] }),
}));
