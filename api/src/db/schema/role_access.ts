import { index, integer, pgTable, uniqueIndex } from "drizzle-orm/pg-core";
import { roles } from "./roles";
import { access } from "./access";
import { relations } from "drizzle-orm";

export const roleAccess = pgTable(
  "role_access",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    role_id: integer()
      .notNull()
      .references(() => roles.id),
    access_id: integer()
      .notNull()
      .references(() => access.id),
  },
  (table) => [
    index("role_access_role_id_idx").on(table.role_id),
    index("role_access_access_id_idx").on(table.access_id),
    uniqueIndex("role_access_role_id_access_id_idx").on(table.role_id, table.access_id),
  ]
);

export const roleAccessRelations = relations(roleAccess, ({ one }) => ({
  access: one(access, { fields: [roleAccess.access_id], references: [access.id] }),
  role: one(roles, { fields: [roleAccess.role_id], references: [roles.id] }),
}));
