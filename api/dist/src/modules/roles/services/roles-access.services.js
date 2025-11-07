"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoleAccessForRole = exports.deleteRoleAccessByRoleId = exports.getRoleAccessByRoleId = exports.getPaginatedTotalRoleAccess = exports.getPaginatedRoleAccess = void 0;
const db_1 = require("@/db");
const schema_1 = require("@/db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const selectedRoleAccessFields = {
    id: schema_1.access.id,
    uuid: schema_1.access.uuid,
    code: schema_1.access.code,
    label: schema_1.access.label,
    module_name: schema_1.modules.name,
    created_at: schema_1.access.created_at,
    updated_at: schema_1.access.updated_at,
};
const getPaginatedRoleAccess = async (roleId, search, limit, offset) => {
    const searchFilter = [];
    if (search) {
        searchFilter.push((0, drizzle_orm_1.ilike)(schema_1.access.code, `%${search}%`));
        searchFilter.push((0, drizzle_orm_1.ilike)(schema_1.access.label, `%${search}%`));
    }
    const data = await db_1.db
        .select(selectedRoleAccessFields)
        .from(schema_1.access)
        .innerJoin(schema_1.modules, (0, drizzle_orm_1.eq)(schema_1.access.module_id, schema_1.modules.id))
        .innerJoin(schema_1.roleAccess, (0, drizzle_orm_1.eq)(schema_1.roleAccess.access_id, schema_1.access.id))
        .innerJoin(schema_1.roles, (0, drizzle_orm_1.eq)(schema_1.roleAccess.role_id, schema_1.roles.id))
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.roles.id, roleId), (0, drizzle_orm_1.isNull)(schema_1.access.deleted_at), (0, drizzle_orm_1.or)(...searchFilter)))
        .orderBy((0, drizzle_orm_1.asc)(schema_1.modules.name), (0, drizzle_orm_1.asc)(schema_1.access.code))
        .limit(limit)
        .offset(offset);
    return data;
};
exports.getPaginatedRoleAccess = getPaginatedRoleAccess;
const getPaginatedTotalRoleAccess = async (roleId, search) => {
    const searchFilter = [];
    if (search) {
        searchFilter.push((0, drizzle_orm_1.ilike)(schema_1.access.code, `%${search}%`));
        searchFilter.push((0, drizzle_orm_1.ilike)(schema_1.access.label, `%${search}%`));
    }
    const [data] = await db_1.db
        .select({ total: (0, drizzle_orm_1.count)() })
        .from(schema_1.access)
        .innerJoin(schema_1.modules, (0, drizzle_orm_1.eq)(schema_1.access.module_id, schema_1.modules.id))
        .innerJoin(schema_1.roleAccess, (0, drizzle_orm_1.eq)(schema_1.roleAccess.access_id, schema_1.access.id))
        .innerJoin(schema_1.roles, (0, drizzle_orm_1.eq)(schema_1.roleAccess.role_id, schema_1.roles.id))
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.roles.id, roleId), (0, drizzle_orm_1.isNull)(schema_1.access.deleted_at), (0, drizzle_orm_1.or)(...searchFilter)));
    return data.total;
};
exports.getPaginatedTotalRoleAccess = getPaginatedTotalRoleAccess;
const getRoleAccessByRoleId = async (roleId) => {
    return await db_1.db.select().from(schema_1.roleAccess).where((0, drizzle_orm_1.eq)(schema_1.roleAccess.role_id, roleId));
};
exports.getRoleAccessByRoleId = getRoleAccessByRoleId;
const deleteRoleAccessByRoleId = async (roleId) => {
    return await db_1.db.delete(schema_1.roleAccess).where((0, drizzle_orm_1.eq)(schema_1.roleAccess.role_id, roleId));
};
exports.deleteRoleAccessByRoleId = deleteRoleAccessByRoleId;
const createRoleAccessForRole = async (roleId, accessIds) => {
    if (accessIds.length === 0)
        return [];
    const values = accessIds.map((accessId) => ({
        role_id: roleId,
        access_id: accessId,
    }));
    return await db_1.db.insert(schema_1.roleAccess).values(values).returning();
};
exports.createRoleAccessForRole = createRoleAccessForRole;
