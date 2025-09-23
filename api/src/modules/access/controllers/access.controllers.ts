import { Request, Response } from "express";
import * as accessService from "../services/access.services";
import { IStoreAcces, IUpdateAcces } from "../validators/access.validators";

export const getPaginatedaccess = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = (req.query.search as string) || "";
  const offset = (page - 1) * limit;

  const data = await accessService.getPaginatedaccess(search, limit, offset);

  const total = await accessService.getPaginatedTotalaccess(search);

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

export const getTotalaccess = async (req: Request, res: Response) => {
  const total = await accessService.getTotalaccess();
  return res.json({ total });
};

export const storeRole = async (req: Request, res: Response) => {
  const { code, label, module_id }: IStoreAcces = req.body;

  const existingRole = await accessService.getAccessByCode(code);

  if (existingRole) {
    return res.status(400).json({ message: "Role code already exists" });
  }

  const data = await accessService.createAccess({ code, label, module_id });

  return res.status(201).json(data);
};

export const updateRole = async (req: Request, res: Response) => {
  const { uuid } = req.params;
  const { code, label, module_id }: IUpdateAcces = req.body;

  const existingRole = await accessService.getRoleByUUID(uuid);

  if (!existingRole) {
    return res.status(404).json({ message: "Role not found" });
  }

  const data = await accessService.updateRole(existingRole.id, { code, label, module_id });

  return res.status(200).json(data);
};

export const destroyRole = async (req: Request, res: Response) => {
  const { uuid } = req.params;
  const existingRole = await accessService.getRoleByUUID(uuid);

  if (!existingRole) {
    return res.status(404).json({ message: "Role not found" });
  }

  const data = await accessService.deleteRole(existingRole.id);

  return res.status(200).json(data);
};

export const restoreRole = async (req: Request, res: Response) => {
  const { uuid } = req.params;
  const existingRole = await accessService.getRoleByUUID(uuid);

  if (!existingRole) {
    return res.status(404).json({ message: "Role not found" });
  }

  const data = await accessService.restoreRole(existingRole.id);

  return res.status(200).json({ data });
};
