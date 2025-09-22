import { db } from "@/db";
import { roles, users } from "@/db/schema";
import { and, asc, count, eq, ilike, isNull, or, SQL } from "drizzle-orm";

const selectedRoleFields = {
  id: roles.id,
  uuid: roles.uuid,
  name: roles.name,
  created_at: roles.created_at,
  updated_at: roles.updated_at,
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

export const getTotalRoles = async () => {
  const [data] = await db.select({ total: count() }).from(roles).where(isNull(roles.deleted_at));
  return data.total;
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
    .where(and(eq(roles.uuid, uuid)));
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
