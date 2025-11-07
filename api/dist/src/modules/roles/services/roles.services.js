"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreRole = exports.deleteRole = exports.updateRole = exports.createRole = exports.GetRoleDetailsById = exports.getRoleByUUID = exports.getRoleByName = exports.getRoleOptions = exports.getTotalRoles = exports.getPaginatedTotalRoles = exports.getPaginatedRoles = void 0;
const db_1 = require("@/db");
const schema_1 = require("@/db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const selectedRoleFields = {
    id: schema_1.roles.id,
    uuid: schema_1.roles.uuid,
    name: (0, drizzle_orm_1.sql) `INITCAP(${schema_1.roles.name})`,
    description: schema_1.roles.description,
    created_at: schema_1.roles.created_at,
    updated_at: schema_1.roles.updated_at,
};
const showRoleFields = {
    id: schema_1.roles.id,
    uuid: schema_1.roles.uuid,
    name: (0, drizzle_orm_1.sql) `INITCAP(${schema_1.roles.name})`,
    description: schema_1.roles.description,
    created_at: schema_1.roles.created_at,
    updated_at: schema_1.roles.updated_at,
    total_users: (0, drizzle_orm_1.sql) `
    CONCAT(
      COUNT(${schema_1.users.id}),
      ' ',
      CASE WHEN COUNT(${schema_1.users.id}) <= 1 THEN 'User' ELSE 'Users' END
    )
  `,
};
const getPaginatedRoles = async (search, limit, offset) => {
    const searchFilter = [];
    if (search) {
        searchFilter.push((0, drizzle_orm_1.ilike)(schema_1.roles.name, `%${search}%`));
    }
    const data = await db_1.db
        .select(selectedRoleFields)
        .from(schema_1.roles)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.isNull)(schema_1.roles.deleted_at), (0, drizzle_orm_1.or)(...searchFilter)))
        .orderBy((0, drizzle_orm_1.asc)(schema_1.roles.name)) // order by is mandatory
        .limit(limit) // the number of rows to return
        .offset(offset); // the number of rows to skip
    return data;
};
exports.getPaginatedRoles = getPaginatedRoles;
const getPaginatedTotalRoles = async (search) => {
    const searchFilter = [];
    if (search) {
        searchFilter.push((0, drizzle_orm_1.ilike)(schema_1.roles.name, `%${search}%`));
    }
    const [data] = await db_1.db
        .select({ total: (0, drizzle_orm_1.count)() })
        .from(schema_1.roles)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.isNull)(schema_1.roles.deleted_at), (0, drizzle_orm_1.or)(...searchFilter)));
    return data.total;
};
exports.getPaginatedTotalRoles = getPaginatedTotalRoles;
const getTotalRoles = async () => {
    const [data] = await db_1.db.select({ total: (0, drizzle_orm_1.count)() }).from(schema_1.roles).where((0, drizzle_orm_1.isNull)(schema_1.roles.deleted_at));
    return data.total;
};
exports.getTotalRoles = getTotalRoles;
const getRoleOptions = async () => {
    const data = await db_1.db
        .select({
        value: schema_1.roles.uuid,
        label: (0, drizzle_orm_1.sql) `
        CONCAT(
          INITCAP(${schema_1.roles.name}),
          ' (',
          COUNT(${schema_1.users.id}),
          CASE WHEN COUNT(${schema_1.users.id}) = 1 THEN ' user' ELSE ' users' END,
          ')'
        )
      `,
    })
        .from(schema_1.roles)
        .innerJoin(schema_1.users, (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.users.role_id, schema_1.roles.id), (0, drizzle_orm_1.isNull)(schema_1.users.deleted_at)))
        .where((0, drizzle_orm_1.isNull)(schema_1.roles.deleted_at))
        .groupBy(schema_1.roles.id, schema_1.roles.uuid, schema_1.roles.name)
        .orderBy((0, drizzle_orm_1.asc)(schema_1.roles.name));
    return data;
};
exports.getRoleOptions = getRoleOptions;
const getRoleByName = async (name) => {
    const [data] = await db_1.db
        .select(selectedRoleFields)
        .from(schema_1.roles)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.roles.name, name), (0, drizzle_orm_1.isNull)(schema_1.roles.deleted_at)));
    return data;
};
exports.getRoleByName = getRoleByName;
const getRoleByUUID = async (uuid) => {
    const [data] = await db_1.db
        .select(selectedRoleFields)
        .from(schema_1.roles)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.roles.uuid, uuid), (0, drizzle_orm_1.isNull)(schema_1.roles.deleted_at)));
    return data;
};
exports.getRoleByUUID = getRoleByUUID;
const GetRoleDetailsById = async (id) => {
    const [data] = await db_1.db
        .select(showRoleFields)
        .from(schema_1.roles)
        .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.users.role_id, schema_1.roles.id))
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.roles.id, id), (0, drizzle_orm_1.isNull)(schema_1.roles.deleted_at)))
        .groupBy(schema_1.roles.id);
    return data;
};
exports.GetRoleDetailsById = GetRoleDetailsById;
const createRole = async ({ name, description }) => {
    const [data] = await db_1.db
        .insert(schema_1.roles)
        .values({
        name,
        description,
    })
        .returning(selectedRoleFields);
    return data;
};
exports.createRole = createRole;
const updateRole = async (id, { name, description }) => {
    const [data] = await db_1.db
        .update(schema_1.roles)
        .set({
        name,
        description,
        updated_at: new Date(),
    })
        .where((0, drizzle_orm_1.eq)(schema_1.roles.id, id))
        .returning(selectedRoleFields);
    return data;
};
exports.updateRole = updateRole;
const deleteRole = async (id) => {
    const [data] = await db_1.db
        .update(schema_1.roles)
        .set({ deleted_at: new Date() })
        .where((0, drizzle_orm_1.eq)(schema_1.roles.id, id))
        .returning(selectedRoleFields);
    return data;
};
exports.deleteRole = deleteRole;
const restoreRole = async (id) => {
    const [data] = await db_1.db.update(schema_1.roles).set({ deleted_at: null }).where((0, drizzle_orm_1.eq)(schema_1.roles.id, id)).returning(selectedRoleFields);
    return data;
};
exports.restoreRole = restoreRole;
