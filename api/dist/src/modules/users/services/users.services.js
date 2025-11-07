"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserOptions = exports.getTotalUsers = exports.getPaginatedTotalUsers = exports.getPaginatedUsers = exports.selectedUserFields = void 0;
const db_1 = require("@/db");
const schema_1 = require("@/db/schema");
const drizzle_orm_1 = require("drizzle-orm");
exports.selectedUserFields = {
    id: schema_1.users.id,
    uuid: schema_1.users.uuid,
    first_name: (0, drizzle_orm_1.sql) `INITCAP(${schema_1.users.first_name})`,
    middle_name: (0, drizzle_orm_1.sql) `INITCAP(${schema_1.users.middle_name})`,
    last_name: (0, drizzle_orm_1.sql) `INITCAP(${schema_1.users.last_name})`,
    email: schema_1.users.email,
    created_at: schema_1.users.created_at,
    role_name: (0, drizzle_orm_1.sql) `INITCAP(${schema_1.roles.name})`,
};
const getPaginatedUsers = async (search, limit, offset, role_uuid) => {
    const searchFilter = [];
    const roleFilter = [];
    if (search) {
        searchFilter.push((0, drizzle_orm_1.ilike)(schema_1.users.first_name, `%${search}%`));
        searchFilter.push((0, drizzle_orm_1.ilike)(schema_1.users.middle_name, `%${search}%`));
        searchFilter.push((0, drizzle_orm_1.ilike)(schema_1.users.last_name, `%${search}%`));
        searchFilter.push((0, drizzle_orm_1.ilike)(schema_1.users.email, `%${search}%`));
    }
    if (role_uuid) {
        roleFilter.push((0, drizzle_orm_1.eq)(schema_1.roles.uuid, role_uuid));
    }
    const data = await db_1.db
        .select(exports.selectedUserFields)
        .from(schema_1.users)
        .innerJoin(schema_1.roles, (0, drizzle_orm_1.eq)(schema_1.users.role_id, schema_1.roles.id))
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.or)(...searchFilter), (0, drizzle_orm_1.or)(...roleFilter), (0, drizzle_orm_1.isNull)(schema_1.users.deleted_at)))
        .orderBy((0, drizzle_orm_1.asc)(schema_1.users.first_name)) // order by is mandatory
        .limit(limit) // the number of rows to return
        .offset(offset); // the number of rows to skip
    return data;
};
exports.getPaginatedUsers = getPaginatedUsers;
const getPaginatedTotalUsers = async (search, role_uuid) => {
    const searchFilter = [];
    const roleFilter = [];
    if (search) {
        searchFilter.push((0, drizzle_orm_1.ilike)(schema_1.users.first_name, `%${search}%`));
        searchFilter.push((0, drizzle_orm_1.ilike)(schema_1.users.middle_name, `%${search}%`));
        searchFilter.push((0, drizzle_orm_1.ilike)(schema_1.users.last_name, `%${search}%`));
        searchFilter.push((0, drizzle_orm_1.ilike)(schema_1.users.email, `%${search}%`));
    }
    if (role_uuid) {
        roleFilter.push((0, drizzle_orm_1.eq)(schema_1.roles.uuid, role_uuid));
    }
    const [data] = await db_1.db
        .select({ total: (0, drizzle_orm_1.count)() })
        .from(schema_1.users)
        .innerJoin(schema_1.roles, (0, drizzle_orm_1.eq)(schema_1.users.role_id, schema_1.roles.id))
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.isNull)(schema_1.users.deleted_at), (0, drizzle_orm_1.or)(...searchFilter), (0, drizzle_orm_1.or)(...roleFilter)));
    return data.total;
};
exports.getPaginatedTotalUsers = getPaginatedTotalUsers;
const getTotalUsers = async () => {
    const [data] = await db_1.db.select({ total: (0, drizzle_orm_1.count)() }).from(schema_1.users).where((0, drizzle_orm_1.isNull)(schema_1.users.deleted_at));
    return data.total;
};
exports.getTotalUsers = getTotalUsers;
const getUserOptions = async () => {
    const data = await db_1.db
        .select({
        value: schema_1.users.uuid,
        label: (0, drizzle_orm_1.sql) `CONCAT(INITCAP(${schema_1.users.first_name}), ' ', INITCAP(${schema_1.users.last_name}))`,
    })
        .from(schema_1.users)
        .where((0, drizzle_orm_1.isNull)(schema_1.users.deleted_at))
        .orderBy((0, drizzle_orm_1.asc)(schema_1.users.first_name));
    return data;
};
exports.getUserOptions = getUserOptions;
