"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.demosTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.demosTable = (0, pg_core_1.pgTable)("demos_table", {
    id: (0, pg_core_1.integer)().primaryKey().generatedAlwaysAsIdentity(),
    uuid: (0, pg_core_1.uuid)().defaultRandom().notNull(),
    name: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
});
