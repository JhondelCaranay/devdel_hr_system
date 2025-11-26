import { date, index, integer, pgTable, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { modules } from "./modules";
import { roleAccess } from "./role_access";

export const access = pgTable(
  "access",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    uuid: uuid().defaultRandom().notNull(),
    code: varchar("code", { length: 100 }).notNull().unique(),
    label: varchar("label", { length: 255 }).notNull(),
    module_id: integer()
      .notNull()
      .references(() => modules.id),
    updated_at: timestamp(),
    created_at: timestamp().defaultNow().notNull(),
    deleted_at: timestamp(),
  },
  (table) => [
    index("access_uuid_idx").on(table.uuid),
    index("access_module_id_idx").on(table.module_id),
    uniqueIndex("access_code_idx").on(table.code),
  ]
);

export const accessRelations = relations(access, ({ one, many }) => ({
  module: one(modules, { fields: [access.module_id], references: [modules.id] }),
  role_access: many(roleAccess),
}));

export type SelectAccess = typeof access.$inferSelect;
export type InsertAccess = typeof access.$inferInsert;
