"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.credentialsRelations = exports.credentials = exports.credentialsStatusEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const users_1 = require("./users");
exports.credentialsStatusEnum = (0, pg_core_1.pgEnum)("credentials_status", ["active", "inactive"]);
exports.credentials = (0, pg_core_1.pgTable)("credentials", {
    id: (0, pg_core_1.integer)().primaryKey().generatedAlwaysAsIdentity(),
    uuid: (0, pg_core_1.uuid)().defaultRandom().notNull(),
    username: (0, pg_core_1.varchar)({ length: 255 }).notNull().unique(),
    password: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    user_id: (0, pg_core_1.integer)()
        .notNull()
        .references(() => users_1.users.id),
    updated_at: (0, pg_core_1.timestamp)(),
    created_at: (0, pg_core_1.timestamp)().defaultNow().notNull(),
    deleted_at: (0, pg_core_1.timestamp)(),
    status: (0, exports.credentialsStatusEnum)().default("active").notNull(),
});
exports.credentialsRelations = (0, drizzle_orm_1.relations)(exports.credentials, ({ one }) => ({
    user: one(users_1.users, { fields: [exports.credentials.user_id], references: [users_1.users.id] }),
}));
