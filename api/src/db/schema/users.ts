import { index, integer, pgTable, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { roles } from "./roles";
import { credentials } from "./credentials";

export const users = pgTable(
  "users",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    uuid: uuid().defaultRandom().notNull(),
    email: varchar({ length: 255 }).unique(),
    first_name: varchar({ length: 255 }).notNull(),
    middle_name: varchar({ length: 255 }),
    last_name: varchar({ length: 255 }).notNull(),
    phone: varchar({ length: 20 }),
    address: varchar({ length: 255 }),
    city: varchar({ length: 100 }),
    province: varchar({ length: 100 }),
    country: varchar({ length: 100 }),
    zip_code: varchar({ length: 20 }),
    role_id: integer()
      .notNull()
      .references(() => roles.id),
    updated_at: timestamp(),
    created_at: timestamp().defaultNow().notNull(),
    deleted_at: timestamp(),
  },
  (table) => [index("users_uuid_idx").on(table.uuid), uniqueIndex("users_email_idx").on(table.email)]
);

export const userRelations = relations(users, ({ one }) => ({
  credential: one(credentials, { fields: [users.id], references: [credentials.user_id] }),
  role: one(roles, { fields: [users.role_id], references: [roles.id] }),
}));

export type SelectUser = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
