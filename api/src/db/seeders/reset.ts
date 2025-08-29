import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./../schema";

import { reset } from "drizzle-seed";
import { ENV } from "@/config/env";

async function seeder() {
  const db = drizzle(ENV.DATABASE_URL);
  await reset(db, schema);
  // exit the process after seeding
  process.exit(0);
}

seeder();
