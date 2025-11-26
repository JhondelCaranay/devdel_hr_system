import { date, index, integer, pgEnum, pgTable, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

export const credentialsStatusEnum = pgEnum("credentials_status", ["active", "inactive"]);

export type ICredentialStatus = (typeof credentialsStatusEnum.enumValues)[number];

export const credentials = pgTable(
  "credentials",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    uuid: uuid().defaultRandom().notNull(),
    username: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
    user_id: integer()
      .notNull()
      .references(() => users.id),
    updated_at: timestamp(),
    created_at: timestamp().defaultNow().notNull(),
    deleted_at: timestamp(),
    status: credentialsStatusEnum().default("active").notNull(),
  },
  (table) => [
    index("user_uuid_idx").on(table.uuid),
    uniqueIndex("user_username_idx").on(table.username),
    index("user_id_idx").on(table.user_id),
    index("credentials_status_idx").on(table.status),
  ]
);

export const credentialsRelations = relations(credentials, ({ one }) => ({
  user: one(users, { fields: [credentials.user_id], references: [users.id] }),
}));
