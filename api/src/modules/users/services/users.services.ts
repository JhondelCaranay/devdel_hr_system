import { db } from "@/db";
import { access, credentials, ICredentialStatus, roleAccess, roles, users } from "@/db/schema";
import { and, asc, count, eq, ilike, isNull, or, SQL } from "drizzle-orm";

export const getPaginatedUsers = async (search: string, limit: number, offset: number) => {
  const searchFilter: SQL[] = [];

  if (search) {
    searchFilter.push(ilike(users.first_name, `%${search}%`));
    searchFilter.push(ilike(users.middle_name, `%${search}%`));
    searchFilter.push(ilike(users.last_name, `%${search}%`));
    searchFilter.push(ilike(users.email, `%${search}%`));
  }

  const data = await db
    .select()
    .from(users)
    .where(or(...searchFilter))
    .orderBy(asc(users.id)) // order by is mandatory
    .limit(limit) // the number of rows to return
    .offset(offset); // the number of rows to skip

  return data;
};

export const getTotalUsers = async () => {
  const [data] = await db.select({ total: count() }).from(users).where(isNull(users.deleted_at));
  return data.total;
};
