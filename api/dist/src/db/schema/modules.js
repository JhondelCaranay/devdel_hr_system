"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleRelations = exports.modules = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const access_1 = require("./access");
exports.modules = (0, pg_core_1.pgTable)("modules", {
    id: (0, pg_core_1.integer)().primaryKey().generatedAlwaysAsIdentity(),
    uuid: (0, pg_core_1.uuid)().defaultRandom().notNull(),
    name: (0, pg_core_1.varchar)({ length: 255 }).notNull().unique(),
    updated_at: (0, pg_core_1.timestamp)(),
    created_at: (0, pg_core_1.timestamp)().defaultNow().notNull(),
    deleted_at: (0, pg_core_1.timestamp)(),
});
exports.moduleRelations = (0, drizzle_orm_1.relations)(exports.modules, ({ many }) => ({
    accesses: many(access_1.access),
}));
