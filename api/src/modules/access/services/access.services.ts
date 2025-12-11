import { db } from "@/db";
import { access, modules, roleAccess, roles, users } from "@/db/schema";
import { and, asc, count, eq, ilike, isNull, notInArray, or, sql, SQL } from "drizzle-orm";
import { IStoreAccess, IUpdateAccess } from "../validators/access.validators";

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

const showAccessFields = {
  id: access.id,
  uuid: access.uuid,
  code: access.code,
  label: access.label,
  module_id: access.module_id,
  created_at: access.created_at,
  updated_at: access.updated_at,
  module_name: modules.name,
};

export const getPaginatedAccess = async (search: string, limit: number, offset: number) => {
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

export const getPaginatedTotalAccess = async (search: string) => {
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
  const searchFilter: SQL[] = [];

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
    .select(showAccessFields)
    .from(access)
    .innerJoin(modules, eq(access.module_id, modules.id))
    .where(and(eq(access.uuid, uuid)));
  return data;
};

export const GetAccessDetailsById = async (id: number) => {
  const [data] = await db
    .select(showAccessFields)
    .from(access)
    .innerJoin(modules, eq(access.module_id, modules.id))
    .where(and(eq(access.id, id), isNull(access.deleted_at)));
  return data;
};

export const createAccess = async ({ code, label, module_id }: IStoreAccess) => {
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

export const updateAccess = async (id: number, { code, label, module_id }: IUpdateAccess) => {
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

export const deleteAccess = async (id: number) => {
  const [data] = await db.update(access).set({ deleted_at: new Date() }).where(eq(access.id, id)).returning();
  return data;
};

export const restoreAccess = async (id: number) => {
  const [data] = await db.update(access).set({ deleted_at: null }).where(eq(access.id, id)).returning();
  return data;
};
