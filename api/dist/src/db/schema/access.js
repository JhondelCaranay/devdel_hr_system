"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessRelations = exports.access = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const modules_1 = require("./modules");
const role_access_1 = require("./role_access");
exports.access = (0, pg_core_1.pgTable)("access", {
    id: (0, pg_core_1.integer)().primaryKey().generatedAlwaysAsIdentity(),
    uuid: (0, pg_core_1.uuid)().defaultRandom().notNull(),
    code: (0, pg_core_1.varchar)("code", { length: 100 }).notNull().unique(),
    label: (0, pg_core_1.varchar)("label", { length: 255 }).notNull(),
    module_id: (0, pg_core_1.integer)()
        .notNull()
        .references(() => modules_1.modules.id),
    updated_at: (0, pg_core_1.timestamp)(),
    created_at: (0, pg_core_1.timestamp)().defaultNow().notNull(),
    deleted_at: (0, pg_core_1.timestamp)(),
});
exports.accessRelations = (0, drizzle_orm_1.relations)(exports.access, ({ one, many }) => ({
    module: one(modules_1.modules, { fields: [exports.access.module_id], references: [modules_1.modules.id] }),
    role_access: many(role_access_1.roleAccess),
}));
