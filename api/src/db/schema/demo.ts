import { integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const demosTable = pgTable("demos_table", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  uuid: uuid().defaultRandom().notNull(),
  name: varchar({ length: 255 }).notNull(),
});
