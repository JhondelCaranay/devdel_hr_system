import { date, integer, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { access } from "./access";

export const modules = pgTable("modules", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  uuid: uuid().defaultRandom().notNull(),
  name: varchar({ length: 255 }).notNull().unique(),
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
});

export const moduleRelations = relations(modules, ({ many }) => ({
  accesses: many(access),
}));
