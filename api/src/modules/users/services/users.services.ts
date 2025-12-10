import { db } from "@/db";
import { access, credentials, ICredentialStatus, roleAccess, roles, users } from "@/db/schema";
import { and, asc, count, eq, ilike, isNull, or, sql, SQL } from "drizzle-orm";

export const selectedUserFields = {
  id: users.id,
  uuid: users.uuid,
  first_name: sql<string>`INITCAP(${users.first_name})`,
  middle_name: sql<string>`INITCAP(${users.middle_name})`,
  last_name: sql<string>`INITCAP(${users.last_name})`,
  email: users.email,
  created_at: users.created_at,
  role_name: sql<string>`INITCAP(${roles.name})`,
};

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
    .select(selectedUserFields)
    .from(users)
    .innerJoin(roles, eq(users.role_id, roles.id))
    .where(and(or(...searchFilter), or(...roleFilter), isNull(users.deleted_at)))
    .orderBy(asc(users.first_name))
    .limit(limit)
    .offset(offset);

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

export const getUserOptions = async () => {
  const data = await db
    .select({
      value: users.uuid,
      label: sql<string>`CONCAT(INITCAP(${users.first_name}), ' ', INITCAP(${users.last_name}))`,
    })
    .from(users)
    .where(isNull(users.deleted_at))
    .orderBy(asc(users.first_name));
  return data;
};
