import { date, index, integer, pgTable, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { access } from "./access";

export const modules = pgTable(
  "modules",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    uuid: uuid().defaultRandom().notNull(),
    name: varchar({ length: 255 }).notNull().unique(),
    updated_at: timestamp(),
    created_at: timestamp().defaultNow().notNull(),
    deleted_at: timestamp(),
  },

  (table) => [index("modules_uuid_idx").on(table.uuid), uniqueIndex("modules_name_idx").on(table.name)]
);
export const moduleRelations = relations(modules, ({ many }) => ({
  accesses: many(access),
}));

export type SelectModule = typeof modules.$inferSelect;
export type InsertModule = typeof modules.$inferInsert;
