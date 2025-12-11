import { Request, Response } from "express";
import * as accessService from "../services/access.services";
import * as rolesService from "../../roles/services/roles.services";
import { IStoreAccess, IUpdateAccess } from "../validators/access.validators";

export const getPaginatedAccess = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = (req.query.search as string) || "";

  const offset = (page - 1) * limit;

  const data = await accessService.getPaginatedAccess(search, limit, offset);

  const total = await accessService.getPaginatedTotalAccess(search);

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

export const getTotalAccess = async (req: Request, res: Response) => {
  const total = await accessService.getTotalaccess();
  return res.json({ total });
};

export const getAccessOptions = async (req: Request, res: Response) => {
  const role_id = (req.query.role_id as string) || "";

  const role = await rolesService.getRoleByUUID(role_id);

  if (!role) {
    return res.status(404).json({ message: "Role not found" });
  }

  const data = await accessService.getAccessOptions(role.id);
  return res.json(data);
};

export const getAccess = async (req: Request, res: Response) => {
  const { uuid }: { uuid?: string } = req.params;
  const access = await accessService.getAccessByUUID(uuid);

  if (!access) {
    return res.status(404).json({ message: "Access not found" });
  }

  const detailedAccess = await accessService.GetAccessDetailsById(access.id);

  return res.status(200).json({ data: detailedAccess });
};

export const storeAccess = async (req: Request, res: Response) => {
  const { code, label, module_id }: IStoreAccess = req.body;

  const existingAccess = await accessService.getAccessByCode(code);

  if (existingAccess) {
    return res.status(400).json({ message: "Access code already exists" });
  }

  const data = await accessService.createAccess({ code, label, module_id });

  return res.status(201).json(data);
};

export const updateAccess = async (req: Request, res: Response) => {
  const { uuid } = req.params;
  const { code, label, module_id }: IUpdateAccess = req.body;

  const existingAccess = await accessService.getAccessByUUID(uuid);

  if (!existingAccess) {
    return res.status(404).json({ message: "Access not found" });
  }

  const data = await accessService.updateAccess(existingAccess.id, { code, label, module_id });

  return res.status(200).json(data);
};

export const destroyAccess = async (req: Request, res: Response) => {
  const { uuid } = req.params;
  const existingAccess = await accessService.getAccessByUUID(uuid);

  if (!existingAccess) {
    return res.status(404).json({ message: "Access not found" });
  }

  const data = await accessService.deleteAccess(existingAccess.id);

  return res.status(200).json(data);
};

export const restoreAccess = async (req: Request, res: Response) => {
  const { uuid } = req.params;
  const existingAccess = await accessService.getAccessByUUID(uuid);

  if (!existingAccess) {
    return res.status(404).json({ message: "Access not found" });
  }

  const data = await accessService.restoreAccess(existingAccess.id);

  return res.status(200).json({ data });
};
