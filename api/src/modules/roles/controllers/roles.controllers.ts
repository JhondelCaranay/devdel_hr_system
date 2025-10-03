import { Request, Response } from "express";
import * as rolesService from "../services/roles.services";
import * as rolesAccessService from "../services/roles-access.services";

export const getPaginatedRoles = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = (req.query.search as string) || "";
  const offset = (page - 1) * limit;

  const data = await rolesService.getPaginatedRoles(search, limit, offset);

  const total = await rolesService.getPaginatedTotalRoles(search);

  return res.json({
    data: data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
};

export const getPaginatedRoleAccess = async (req: Request, res: Response) => {
  const { uuid }: { uuid?: string } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = (req.query.search as string) || "";
  const offset = (page - 1) * limit;

  const role = await rolesService.getRoleByUUID(uuid);

  if (!role) {
    return res.status(404).json({ message: "Role not found" });
  }

  const data = await rolesAccessService.getPaginatedRoleAccess(role.id, search, limit, offset);
  const total = await rolesAccessService.getPaginatedTotalRoleAccess(role.id, search);

  return res.json({
    data: data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
};

export const getTotalRoles = async (req: Request, res: Response) => {
  const total = await rolesService.getTotalRoles();
  return res.json({ total });
};

export const getRoleOptions = async (req: Request, res: Response) => {
  const data = await rolesService.getRoleOptions();
  return res.json(data);
};

export const getRole = async (req: Request, res: Response) => {
  const { uuid }: { uuid?: string } = req.params;
  const role = await rolesService.getRoleByUUID(uuid);

  if (!role) {
    return res.status(404).json({ message: "Role not found" });
  }

  const detailedRole = await rolesService.GetRoleDetailsById(role.id);

  return res.status(200).json({ data: detailedRole });
};

export const storeRole = async (req: Request, res: Response) => {
  const { name, description }: { name: string; description: string } = req.body;

  const existingRole = await rolesService.getRoleByName(name);

  if (existingRole) {
    return res.status(400).json({ message: "Role name already exists" });
  }

  const data = await rolesService.createRole({ name, description });

  return res.status(201).json({ data });
};

export const updateRole = async (req: Request, res: Response) => {
  const { uuid } = req.params;
  const { name, description }: { name: string; description: string } = req.body;

  const existingRole = await rolesService.getRoleByUUID(uuid);

  if (!existingRole) {
    return res.status(404).json({ message: "Role not found" });
  }

  const data = await rolesService.updateRole(existingRole.id, { name, description });

  return res.status(200).json({ data });
};

export const updateCopyRoleAccess = async (req: Request, res: Response) => {
  const { uuid: copy_to_uuid } = req.params;
  const { copy_from_uuid }: { copy_from_uuid: string } = req.body;

  // get both roles
  const copyFromData = await rolesService.getRoleByUUID(copy_from_uuid);
  if (!copyFromData) {
    return res.status(404).json({ message: "Role not found" });
  }

  const copyToData = await rolesService.getRoleByUUID(copy_to_uuid);
  if (!copyToData) {
    return res.status(404).json({ message: "Role not found" });
  }

  // clear existing access
  await rolesAccessService.deleteRoleAccessByRoleId(copyToData.id);

  // fetch access from source
  const fromAccess = await rolesAccessService.getRoleAccessByRoleId(copyFromData.id);

  if (fromAccess.length === 0) {
    return res.status(200).json({
      message: "Source role has no access to copy",
      copied: 0,
    });
  }

  // insert into target
  const inserted = await rolesAccessService.createRoleAccessForRole(
    copyToData.id,
    fromAccess.map((a) => a.access_id)
  );

  return res.status(200).json({
    message: "Role access copied successfully",
    data: `Inserted access ${inserted.length}`,
  });
};

export const destroyRole = async (req: Request, res: Response) => {
  const { uuid } = req.params;
  const existingRole = await rolesService.getRoleByUUID(uuid);

  if (!existingRole) {
    return res.status(404).json({ message: "Role not found" });
  }

  const data = await rolesService.deleteRole(existingRole.id);

  return res.status(200).json({ data });
};

export const restoreRole = async (req: Request, res: Response) => {
  const { uuid } = req.params;
  const existingRole = await rolesService.getRoleByUUID(uuid);

  if (!existingRole) {
    return res.status(404).json({ message: "Role not found" });
  }

  const data = await rolesService.restoreRole(existingRole.id);

  return res.status(200).json({ data });
};
