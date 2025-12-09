import { db } from "@/db";
import { access, modules, roleAccess, roles, users } from "@/db/schema";
import { and, asc, count, eq, ilike, isNull, or, sql, SQL } from "drizzle-orm";

const selectedRoleAccessFields = {
  id: access.id,
  uuid: access.uuid,
  code: access.code,
  label: access.label,
  module_name: modules.name,
  created_at: access.created_at,
  updated_at: access.updated_at,
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

export const getRoleAccessByRoleId = async (roleId: number) => {
  return await db.select().from(roleAccess).where(eq(roleAccess.role_id, roleId));
};

// clear all access
export const deleteRoleAccessByRoleId = async (roleId: number) => {
  return await db.delete(roleAccess).where(eq(roleAccess.role_id, roleId));
};

// clear specific access
export const deleteRoleAccess = async (roleId: number, accessId: number) => {
  return await db
    .delete(roleAccess)
    .where(and(eq(roleAccess.role_id, roleId), eq(roleAccess.access_id, accessId)))
    .returning();
};

export const createRoleAccessForRole = async (roleId: number, accessIds: number[]) => {
  if (accessIds.length === 0) return [];

  const values = accessIds.map((accessId) => ({
    role_id: roleId,
    access_id: accessId,
  }));

  return await db.insert(roleAccess).values(values).returning();
};
