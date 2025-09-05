import { Request, Response } from "express";
import { ILogin, IRegister } from "../validators/auth.validators";
import * as authService from "../services/auth.services";
import { comparePassword, hashPassword } from "@/utils/hashPassword";
import { generateTokens, setJwtCookies } from "@/utils/jwt";

export const register = async (req: Request<{}, {}, IRegister>, res: Response) => {
  const body = req.body;

  const existingUser = await authService.findUserByEmailOrUsername(body.email, body.username);

  if (existingUser) {
    return res.status(400).json({ message: "Email or Username already exists" });
  }

  const role = await authService.findRoleByName("user");

  if (!role) {
    return res.status(400).json({ message: "Default role not found" });
  }

  const newUser = await authService.register({
    ...body,
    role_id: role.id,
  });

  if (!newUser) {
    return res.status(400).json({ message: "Registration failed" });
  }

  const hashedPassword = await hashPassword(body.password);

  await authService.createCredential({
    userId: newUser.id,
    username: body.username,
    password: hashedPassword,
    status: "active",
  });

  return res.status(200).json({ message: "Registration successful" });
};

export const login = async (req: Request<{}, {}, ILogin>, res: Response) => {
  const body = req.body;

  const existingUser = await authService.findUserByEmailOrUsername(body.username, body.username);

  if (!existingUser) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const comparedPassword = await comparePassword(body.password, existingUser.credentials.password);

  if (!comparedPassword) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const { access, refresh } = await generateTokens(existingUser.users.id, existingUser.credentials.username);

  setJwtCookies(res, access, refresh);

  const permission = await authService.getUserAccess(existingUser.users.id);

  const formattedPermissions = permission.map((perm) => perm.code);

  return res.status(200).json({ message: "Login successful", accessToken: access, permissions: formattedPermissions });
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return res.status(200).json({ message: "Logout successful" });
};

export const refreshToken = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  const existingUser = await authService.findUserById(userId!);

  if (!existingUser) {
    return res.status(400).json({ message: "User not found" });
  }

  const { access, refresh } = await generateTokens(existingUser.users.id, existingUser.credentials.username);

  setJwtCookies(res, access, refresh);

  return res.status(200).json({ message: "Token refreshed", accessToken: access });
};

export const getMe = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  const existingUser = await authService.findUserById(userId!);

  if (!existingUser) {
    return res.status(400).json({ message: "User not found" });
  }

  return res.status(200).json(existingUser.users);
};

export const getMyAccess = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const access = await authService.getUserAccess(userId!);
  return res.status(200).json(access);
};
