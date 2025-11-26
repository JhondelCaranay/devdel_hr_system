import { index, integer, pgTable, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

export const demosTable = pgTable(
  "demos_table",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    uuid: uuid().defaultRandom().notNull(),
    name: varchar({ length: 255 }).notNull(),
  },
  (table) => [index("demos_table_uuid_idx").on(table.uuid), index("demos_table_name_idx").on(table.name)]
);
