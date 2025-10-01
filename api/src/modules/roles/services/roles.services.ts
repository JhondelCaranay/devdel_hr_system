import { db } from "@/db";
import { access, modules, roleAccess, roles, users } from "@/db/schema";
import { and, asc, count, eq, ilike, isNull, or, sql, SQL } from "drizzle-orm";

const selectedRoleFields = {
  id: roles.id,
  uuid: roles.uuid,
  name: sql<string>`INITCAP(${roles.name})`,
  description: roles.description,
  created_at: roles.created_at,
  updated_at: roles.updated_at,
};

const showRoleFields = {
  id: roles.id,
  uuid: roles.uuid,
  name: sql<string>`INITCAP(${roles.name})`,
  description: roles.description,
  created_at: roles.created_at,
  updated_at: roles.updated_at,
  total_users: sql<string>`
    CONCAT(
      COUNT(${users.id}),
      ' ',
      CASE WHEN COUNT(${users.id}) = 1 THEN 'User' ELSE 'Users' END
    )
  `,
};

const selectedRoleAccessFields = {
  id: access.id,
  uuid: access.uuid,
  code: access.code,
  label: access.label,
  module_name: modules.name,
  created_at: access.created_at,
  updated_at: access.updated_at,
};

export const getPaginatedRoles = async (search: string, limit: number, offset: number) => {
  const searchFilter: SQL[] = [];

  if (search) {
    searchFilter.push(ilike(roles.name, `%${search}%`));
  }

  const data = await db
    .select(selectedRoleFields)
    .from(roles)
    .where(and(isNull(roles.deleted_at), or(...searchFilter)))
    .orderBy(asc(roles.name)) // order by is mandatory
    .limit(limit) // the number of rows to return
    .offset(offset); // the number of rows to skip

  return data;
};

export const getPaginatedTotalRoles = async (search: string) => {
  const searchFilter: SQL[] = [];

  if (search) {
    searchFilter.push(ilike(roles.name, `%${search}%`));
  }

  const [data] = await db
    .select({ total: count() })
    .from(roles)
    .where(and(isNull(roles.deleted_at), or(...searchFilter)));
  return data.total;
};

export const getPaginatedRoleAccess = async (roleId: number, search: string, limit: number, offset: number) => {
  const searchFilter: SQL[] = [];

  if (search) {
    searchFilter.push(ilike(access.code, `%${search}%`));
    searchFilter.push(ilike(access.label, `%${search}%`));
  }

  const data = await db
    .select(selectedRoleAccessFields)
    .from(access)
    .innerJoin(modules, eq(access.module_id, modules.id))
    .innerJoin(roleAccess, eq(roleAccess.access_id, access.id))
    .innerJoin(roles, eq(roleAccess.role_id, roles.id))
    .where(and(eq(roles.id, roleId), isNull(access.deleted_at), or(...searchFilter)))
    .orderBy(asc(modules.name), asc(access.code))
    .limit(limit)
    .offset(offset);

  return data;
};

export const getPaginatedTotalRoleAccess = async (roleId: number, search: string) => {
  const searchFilter: SQL[] = [];

  if (search) {
    searchFilter.push(ilike(access.code, `%${search}%`));
    searchFilter.push(ilike(access.label, `%${search}%`));
  }
  const [data] = await db
    .select({ total: count() })
    .from(access)
    .innerJoin(modules, eq(access.module_id, modules.id))
    .innerJoin(roleAccess, eq(roleAccess.access_id, access.id))
    .innerJoin(roles, eq(roleAccess.role_id, roles.id))
    .where(and(eq(roles.id, roleId), isNull(access.deleted_at), or(...searchFilter)));
  return data.total;
};

export const getTotalRoles = async () => {
  const [data] = await db.select({ total: count() }).from(roles).where(isNull(roles.deleted_at));
  return data.total;
};

export const getRoleOptions = async () => {
  const data = await db
    .select({
      value: roles.uuid,
      label: sql<string>`
        CONCAT(
          INITCAP(${roles.name}),
          ' (',
          COUNT(${users.id}),
          CASE WHEN COUNT(${users.id}) = 1 THEN ' user' ELSE ' users' END,
          ')'
        )
      `,
    })
    .from(roles)
    .innerJoin(users, and(eq(users.role_id, roles.id), isNull(users.deleted_at)))
    .where(isNull(roles.deleted_at))
    .groupBy(roles.id, roles.uuid, roles.name)
    .orderBy(asc(roles.name));

  return data;
};

export const getRoleByName = async (name: string) => {
  const [data] = await db
    .select(selectedRoleFields)
    .from(roles)
    .where(and(eq(roles.name, name), isNull(roles.deleted_at)));
  return data;
};

export const getRoleByUUID = async (uuid: string) => {
  const [data] = await db
    .select(selectedRoleFields)
    .from(roles)
    .where(and(eq(roles.uuid, uuid), isNull(roles.deleted_at)));
  return data;
};

export const GetRoleDetailsById = async (id: number) => {
  const [data] = await db
    .select(showRoleFields)
    .from(roles)
    .innerJoin(users, eq(users.role_id, roles.id))
    .where(and(eq(roles.id, id), isNull(roles.deleted_at)))
    .groupBy(roles.id);
  return data;
};

export const createRole = async ({ name, description }: { name: string; description: string }) => {
  const [data] = await db
    .insert(roles)
    .values({
      name,
      description,
    })
    .returning(selectedRoleFields);
  return data;
};

export const updateRole = async (id: number, { name, description }: { name: string; description: string }) => {
  const [data] = await db
    .update(roles)
    .set({
      name,
      description,
      updated_at: new Date(),
    })
    .where(eq(roles.id, id))
    .returning(selectedRoleFields);
  return data;
};

export const deleteRole = async (id: number) => {
  const [data] = await db
    .update(roles)
    .set({ deleted_at: new Date() })
    .where(eq(roles.id, id))
    .returning(selectedRoleFields);
  return data;
};

export const restoreRole = async (id: number) => {
  const [data] = await db.update(roles).set({ deleted_at: null }).where(eq(roles.id, id)).returning(selectedRoleFields);
  return data;
};
