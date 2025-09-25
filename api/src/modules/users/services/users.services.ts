import { db } from "@/db";
import { access, credentials, ICredentialStatus, roleAccess, roles, users } from "@/db/schema";
import { and, asc, count, eq, ilike, isNull, or, SQL } from "drizzle-orm";

export const getPaginatedUsers = async (search: string, limit: number, offset: number, role_uuid: string) => {
  const searchFilter: SQL[] = [];
  const roleFilter: SQL[] = [];

  if (search) {
    searchFilter.push(ilike(users.first_name, `%${search}%`));
    searchFilter.push(ilike(users.middle_name, `%${search}%`));
    searchFilter.push(ilike(users.last_name, `%${search}%`));
    searchFilter.push(ilike(users.email, `%${search}%`));
  }

  if (role_uuid) {
    roleFilter.push(eq(roles.uuid, role_uuid));
  }

  const data = await db
    .select({
      first_name: users.first_name,
      middle_name: users.middle_name,
      last_name: users.last_name,
      email: users.email,
      created_at: users.created_at,
      role_name: roles.name,
    })
    .from(users)
    .innerJoin(roles, eq(users.role_id, roles.id))
    .where(and(or(...searchFilter), or(...roleFilter), isNull(users.deleted_at)))
    .orderBy(asc(users.first_name)) // order by is mandatory
    .limit(limit) // the number of rows to return
    .offset(offset); // the number of rows to skip

  return data;
};

export const getPaginatedTotalUsers = async (search: string, role_uuid: string) => {
  const searchFilter: SQL[] = [];
  const roleFilter: SQL[] = [];

  if (search) {
    searchFilter.push(ilike(users.first_name, `%${search}%`));
    searchFilter.push(ilike(users.middle_name, `%${search}%`));
    searchFilter.push(ilike(users.last_name, `%${search}%`));
    searchFilter.push(ilike(users.email, `%${search}%`));
  }

  if (role_uuid) {
    roleFilter.push(eq(roles.uuid, role_uuid));
  }

  const [data] = await db
    .select({ total: count() })
    .from(users)
    .innerJoin(roles, eq(users.role_id, roles.id))
    .where(and(isNull(users.deleted_at), or(...searchFilter), or(...roleFilter)));
  return data.total;
};

export const getTotalUsers = async () => {
  const [data] = await db.select({ total: count() }).from(users).where(isNull(users.deleted_at));
  return data.total;
};
