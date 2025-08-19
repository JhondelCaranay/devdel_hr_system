import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./src/db/schema";
import { ENV } from "./src/config/env";

import { reset } from "drizzle-seed";

async function seeder() {
  const db = drizzle(ENV.DATABASE_URL);
  await reset(db, schema);

  // exit the process after seeding
  process.exit(0);
}

seeder();
