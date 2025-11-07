"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCredential = exports.register = exports.getUserAccess = exports.findRoleByName = exports.findUserById = exports.findUserByEmailOrUsername = void 0;
const db_1 = require("@/db");
const schema_1 = require("@/db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const findUserByEmailOrUsername = async (email, username) => {
    const [user] = await db_1.db
        .select()
        .from(schema_1.users)
        .innerJoin(schema_1.credentials, (0, drizzle_orm_1.eq)(schema_1.users.id, schema_1.credentials.user_id))
        .innerJoin(schema_1.roles, (0, drizzle_orm_1.eq)(schema_1.users.role_id, schema_1.roles.id))
        .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.users.email, email), (0, drizzle_orm_1.eq)(schema_1.credentials.username, username)));
    return user;
};
exports.findUserByEmailOrUsername = findUserByEmailOrUsername;
const findUserById = async (id) => {
    const [user] = await db_1.db
        .select()
        .from(schema_1.users)
        .innerJoin(schema_1.credentials, (0, drizzle_orm_1.eq)(schema_1.users.id, schema_1.credentials.user_id))
        .innerJoin(schema_1.roles, (0, drizzle_orm_1.eq)(schema_1.users.role_id, schema_1.roles.id))
        .where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
    return user;
};
exports.findUserById = findUserById;
const findRoleByName = async (name) => {
    const [role] = await db_1.db.select().from(schema_1.roles).where((0, drizzle_orm_1.eq)(schema_1.roles.name, name));
    return role;
};
exports.findRoleByName = findRoleByName;
const getUserAccess = async (userId) => {
    const userAccess = await db_1.db
        .select({ code: schema_1.access.code })
        .from(schema_1.users)
        .innerJoin(schema_1.roles, (0, drizzle_orm_1.eq)(schema_1.users.role_id, schema_1.roles.id))
        .innerJoin(schema_1.roleAccess, (0, drizzle_orm_1.eq)(schema_1.roles.id, schema_1.roleAccess.role_id))
        .innerJoin(schema_1.access, (0, drizzle_orm_1.eq)(schema_1.roleAccess.access_id, schema_1.access.id))
        .where((0, drizzle_orm_1.eq)(schema_1.users.id, userId));
    return userAccess;
};
exports.getUserAccess = getUserAccess;
const register = async (data) => {
    const [demo] = await db_1.db
        .insert(schema_1.users)
        .values({
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        role_id: data.role_id,
    })
        .returning();
    return demo;
};
exports.register = register;
const createCredential = async (data) => {
    const [credential] = await db_1.db
        .insert(schema_1.credentials)
        .values({
        username: data.username,
        password: data.password,
        user_id: data.userId,
        status: data.status,
    })
        .returning();
    return credential;
};
exports.createCredential = createCredential;
