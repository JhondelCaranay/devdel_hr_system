import { db } from "@/db";
import { access, modules, roleAccess, roles, users } from "@/db/schema";
import { and, asc, count, eq, ilike, isNull, notInArray, or, sql, SQL } from "drizzle-orm";
import { IStoreAcces, IUpdateAcces } from "../validators/access.validators";

const selectedAccessFields = {
  id: access.id,
  uuid: access.uuid,
  code: access.code,
  label: access.label,
  module_id: access.module_id,
  created_at: access.created_at,
  updated_at: access.updated_at,
  module_name: modules.name,
};

export const getPaginatedRoleAccess = async (search: string, limit: number, offset: number, roleUuid?: string) => {
  const searchFilter: SQL[] = [];

  if (search) {
    searchFilter.push(ilike(access.code, `%${search}%`));
    searchFilter.push(ilike(access.label, `%${search}%`));
  }

  const data = await db
    .select({
      id: access.id,
      uuid: access.uuid,
      code: access.code,
      label: access.label,
      moduleName: modules.name,
    })
    .from(access)
    .innerJoin(modules, eq(access.module_id, modules.id))
    .innerJoin(roleAccess, eq(roleAccess.access_id, access.id))
    .innerJoin(roles, eq(roleAccess.role_id, roles.id))
    .where(and(isNull(access.deleted_at), or(...searchFilter), roleUuid ? eq(roles.uuid, roleUuid) : undefined))
    .orderBy(asc(modules.name), asc(access.code))
    .limit(limit)
    .offset(offset);

  return data;
};

export const getPaginatedaccess = async (search: string, limit: number, offset: number) => {
  const searchFilter: SQL[] = [];

  if (search) {
    searchFilter.push(ilike(access.code, `%${search}%`));
    searchFilter.push(ilike(access.label, `%${search}%`));
  }

  const data = await db
    .select(selectedAccessFields)
    .from(access)
    .innerJoin(modules, eq(access.module_id, modules.id))
    .where(and(isNull(access.deleted_at), or(...searchFilter)))
    .orderBy(asc(modules.name), asc(access.code))
    .limit(limit)
    .offset(offset);

  return data;
};

export const getPaginatedTotalaccess = async (search: string) => {
  const searchFilter: SQL[] = [];

  if (search) {
    searchFilter.push(ilike(access.code, `%${search}%`));
    searchFilter.push(ilike(access.label, `%${search}%`));
  }

  const [data] = await db
    .select({ total: count() })
    .from(access)
    .where(and(isNull(access.deleted_at), or(...searchFilter)));
  return data.total;
};

export const getTotalaccess = async () => {
  const [data] = await db.select({ total: count() }).from(access).where(isNull(access.deleted_at));
  return data.total;
};
export const getAccessOptions = async (role_id?: number) => {
  console.log("🚀 ~ getAccessOptions ~ role_id:", role_id);
  const searchFilter: SQL[] = [];
  // let whereCondition = isNull(access.deleted_at);

  if (role_id) {
    searchFilter.push(
      notInArray(
        access.id,
        db
          .select({ id: roleAccess.access_id })
          .from(roleAccess)
          .where(eq(roleAccess.role_id, Number(role_id)))
      )
    );
  }
  const data = await db
    .select({
      value: access.uuid,
      label: sql<string>`
        CONCAT(
          INITCAP(${access.label}),
          ' (',
          COUNT(${roles.id}),
          CASE WHEN COUNT(${roles.id}) = 1 THEN ' role' ELSE ' roles' END,
          ')'
        )
      `,
    })
    .from(access)
    .leftJoin(roleAccess, eq(roleAccess.access_id, access.id))
    .leftJoin(roles, eq(roles.id, roleAccess.role_id))
    .where(and(isNull(access.deleted_at), ...searchFilter))
    .groupBy(access.id, access.uuid, access.label)
    .orderBy(asc(access.label));

  return data;
};

export const getAccessByCode = async (code: string) => {
  const [data] = await db
    .select(selectedAccessFields)
    .from(access)
    .innerJoin(modules, eq(access.module_id, modules.id))
    .where(and(eq(access.code, code)));
  return data;
};

export const getAccessByUUID = async (uuid: string) => {
  const [data] = await db
    .select(selectedAccessFields)
    .from(access)
    .innerJoin(modules, eq(access.module_id, modules.id))
    .where(and(eq(access.uuid, uuid)));
  return data;
};

export const createAccess = async ({ code, label, module_id }: IStoreAcces) => {
  const [data] = await db
    .insert(access)
    .values({
      code,
      label,
      module_id,
    })
    .returning();
  return data;
};

export const updateRole = async (id: number, { code, label, module_id }: IUpdateAcces) => {
  const [data] = await db
    .update(access)
    .set({
      code,
      label,
      module_id,
      updated_at: new Date(),
    })
    .where(eq(access.id, id))
    .returning();
  return data;
};

export const deleteRole = async (id: number) => {
  const [data] = await db.update(access).set({ deleted_at: new Date() }).where(eq(access.id, id)).returning();
  return data;
};

export const restoreRole = async (id: number) => {
  const [data] = await db.update(access).set({ deleted_at: null }).where(eq(access.id, id)).returning();
  return data;
};
