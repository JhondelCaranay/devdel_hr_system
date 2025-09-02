import { db } from "@/db";
import { IRegister } from "../validators/auth.validators";
import { access, credentials, ICredentialStatus, roleAccess, roles, users } from "@/db/schema";
import { eq, or } from "drizzle-orm";

export const findUserByEmailOrUsername = async (email: string, username: string) => {
  const [user] = await db
    .select()
    .from(users)
    .innerJoin(credentials, eq(users.id, credentials.user_id))
    .where(or(eq(users.email, email), eq(credentials.username, username)));
  return user;
};

export const findUserById = async (id: number) => {
  const [user] = await db
    .select()
    .from(users)
    .innerJoin(credentials, eq(users.id, credentials.user_id))
    .where(eq(users.id, id));
  return user;
};

export const findRoleByName = async (name: string) => {
  const [role] = await db.select().from(roles).where(eq(roles.name, name));
  return role;
};

export const getUserAccess = async (userId: number) => {
  const userAccess = await db
    .select({ code: access.code })
    .from(users)
    .innerJoin(roles, eq(users.role_id, roles.id))
    .innerJoin(roleAccess, eq(roles.id, roleAccess.role_id))
    .innerJoin(access, eq(roleAccess.access_id, access.id))
    .where(eq(users.id, userId));
  return userAccess;
};

export const register = async (
  data: IRegister & {
    role_id: number;
  }
) => {
  const [demo] = await db
    .insert(users)
    .values({
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      role_id: data.role_id,
    })
    .returning();
  return demo;
};

export const createCredential = async (data: {
  userId: number;
  username: string;
  password: string;
  status: ICredentialStatus;
}) => {
  const [credential] = await db
    .insert(credentials)
    .values({
      username: data.username,
      password: data.password,
      user_id: data.userId,
      status: data.status,
    })
    .returning();
  return credential;
};
