"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreRole = exports.deleteRole = exports.updateRole = exports.createAccess = exports.getRoleByUUID = exports.getAccessByCode = exports.getTotalaccess = exports.getPaginatedTotalaccess = exports.getPaginatedaccess = exports.getPaginatedRoleAccess = void 0;
const db_1 = require("@/db");
const schema_1 = require("@/db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const selectedAccessFields = {
    id: schema_1.access.id,
    uuid: schema_1.access.uuid,
    code: schema_1.access.code,
    label: schema_1.access.label,
    module_id: schema_1.access.module_id,
    created_at: schema_1.access.created_at,
    updated_at: schema_1.access.updated_at,
    module_name: schema_1.modules.name,
};
const getPaginatedRoleAccess = async (search, limit, offset, roleUuid) => {
    const searchFilter = [];
    if (search) {
        searchFilter.push((0, drizzle_orm_1.ilike)(schema_1.access.code, `%${search}%`));
        searchFilter.push((0, drizzle_orm_1.ilike)(schema_1.access.label, `%${search}%`));
    }
    const data = await db_1.db
        .select({
        id: schema_1.access.id,
        uuid: schema_1.access.uuid,
        code: schema_1.access.code,
        label: schema_1.access.label,
        moduleName: schema_1.modules.name,
    })
        .from(schema_1.access)
        .innerJoin(schema_1.modules, (0, drizzle_orm_1.eq)(schema_1.access.module_id, schema_1.modules.id))
        .innerJoin(schema_1.roleAccess, (0, drizzle_orm_1.eq)(schema_1.roleAccess.access_id, schema_1.access.id))
        .innerJoin(schema_1.roles, (0, drizzle_orm_1.eq)(schema_1.roleAccess.role_id, schema_1.roles.id))
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.isNull)(schema_1.access.deleted_at), (0, drizzle_orm_1.or)(...searchFilter), roleUuid ? (0, drizzle_orm_1.eq)(schema_1.roles.uuid, roleUuid) : undefined))
        .orderBy((0, drizzle_orm_1.asc)(schema_1.modules.name), (0, drizzle_orm_1.asc)(schema_1.access.code))
        .limit(limit)
        .offset(offset);
    return data;
};
exports.getPaginatedRoleAccess = getPaginatedRoleAccess;
const getPaginatedaccess = async (search, limit, offset) => {
    const searchFilter = [];
    if (search) {
        searchFilter.push((0, drizzle_orm_1.ilike)(schema_1.access.code, `%${search}%`));
        searchFilter.push((0, drizzle_orm_1.ilike)(schema_1.access.label, `%${search}%`));
    }
    const data = await db_1.db
        .select(selectedAccessFields)
        .from(schema_1.access)
        .innerJoin(schema_1.modules, (0, drizzle_orm_1.eq)(schema_1.access.module_id, schema_1.modules.id))
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.isNull)(schema_1.access.deleted_at), (0, drizzle_orm_1.or)(...searchFilter)))
        .orderBy((0, drizzle_orm_1.asc)(schema_1.modules.name), (0, drizzle_orm_1.asc)(schema_1.access.code))
        .limit(limit)
        .offset(offset);
    return data;
};
exports.getPaginatedaccess = getPaginatedaccess;
const getPaginatedTotalaccess = async (search) => {
    const searchFilter = [];
    if (search) {
        searchFilter.push((0, drizzle_orm_1.ilike)(schema_1.access.code, `%${search}%`));
        searchFilter.push((0, drizzle_orm_1.ilike)(schema_1.access.label, `%${search}%`));
    }
    const [data] = await db_1.db
        .select({ total: (0, drizzle_orm_1.count)() })
        .from(schema_1.access)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.isNull)(schema_1.access.deleted_at), (0, drizzle_orm_1.or)(...searchFilter)));
    return data.total;
};
exports.getPaginatedTotalaccess = getPaginatedTotalaccess;
const getTotalaccess = async () => {
    const [data] = await db_1.db.select({ total: (0, drizzle_orm_1.count)() }).from(schema_1.access).where((0, drizzle_orm_1.isNull)(schema_1.access.deleted_at));
    return data.total;
};
exports.getTotalaccess = getTotalaccess;
const getAccessByCode = async (code) => {
    const [data] = await db_1.db
        .select(selectedAccessFields)
        .from(schema_1.access)
        .innerJoin(schema_1.modules, (0, drizzle_orm_1.eq)(schema_1.access.module_id, schema_1.modules.id))
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.access.code, code)));
    return data;
};
exports.getAccessByCode = getAccessByCode;
const getRoleByUUID = async (uuid) => {
    const [data] = await db_1.db
        .select(selectedAccessFields)
        .from(schema_1.access)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.access.uuid, uuid)));
    return data;
};
exports.getRoleByUUID = getRoleByUUID;
const createAccess = async ({ code, label, module_id }) => {
    const [data] = await db_1.db
        .insert(schema_1.access)
        .values({
        code,
        label,
        module_id,
    })
        .returning();
    return data;
};
exports.createAccess = createAccess;
const updateRole = async (id, { code, label, module_id }) => {
    const [data] = await db_1.db
        .update(schema_1.access)
        .set({
        code,
        label,
        module_id,
        updated_at: new Date(),
    })
        .where((0, drizzle_orm_1.eq)(schema_1.access.id, id))
        .returning();
    return data;
};
exports.updateRole = updateRole;
const deleteRole = async (id) => {
    const [data] = await db_1.db.update(schema_1.access).set({ deleted_at: new Date() }).where((0, drizzle_orm_1.eq)(schema_1.access.id, id)).returning();
    return data;
};
exports.deleteRole = deleteRole;
const restoreRole = async (id) => {
    const [data] = await db_1.db.update(schema_1.access).set({ deleted_at: null }).where((0, drizzle_orm_1.eq)(schema_1.access.id, id)).returning();
    return data;
};
exports.restoreRole = restoreRole;
