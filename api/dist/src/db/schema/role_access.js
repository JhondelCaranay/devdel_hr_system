"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleAccess = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const roles_1 = require("./roles");
const access_1 = require("./access");
exports.roleAccess = (0, pg_core_1.pgTable)("role_access", {
    id: (0, pg_core_1.integer)().primaryKey().generatedAlwaysAsIdentity(),
    role_id: (0, pg_core_1.integer)()
        .notNull()
        .references(() => roles_1.roles.id),
    access_id: (0, pg_core_1.integer)()
        .notNull()
        .references(() => access_1.access.id),
});
