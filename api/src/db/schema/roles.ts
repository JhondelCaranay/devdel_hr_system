import { date, integer, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { roleAccess } from "./role_access";

export const roles = pgTable("roles", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  uuid: uuid().defaultRandom().notNull(),
  name: varchar({ length: 255 }).notNull().unique(),
  description: varchar({ length: 500 }),
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
});

export const roleRelations = relations(roles, ({ many }) => ({
  users: many(users),
  role_access: many(roleAccess),
}));
