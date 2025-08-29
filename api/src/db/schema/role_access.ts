import { integer, pgTable } from "drizzle-orm/pg-core";
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
