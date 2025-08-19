import { date, integer, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { roles } from "./roles";
import { access } from "./access";

export const roleAccess = pgTable("role_access", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  role_id: integer()
    .notNull()
    .references(() => roles.id),
  access_id: integer()
    .notNull()
    .references(() => access.id),
});
