import { date, index, integer, pgTable, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { roleAccess } from "./role_access";

export const roles = pgTable(
  "roles",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    uuid: uuid().defaultRandom().notNull(),
    name: varchar({ length: 255 }).notNull().unique(),
    description: varchar({ length: 500 }),
    updated_at: timestamp(),
    created_at: timestamp().defaultNow().notNull(),
    deleted_at: timestamp(),
  },
  (table) => [index("roles_uuid_idx").on(table.uuid), uniqueIndex("roles_name_idx").on(table.name)]
);

export const roleRelations = relations(roles, ({ many }) => ({
  users: many(users),
  role_access: many(roleAccess),
}));

export type SelectRole = typeof roles.$inferSelect;
export type InsertRole = typeof roles.$inferInsert;
