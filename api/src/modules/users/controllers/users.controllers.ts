import { Request, Response } from "express";
import * as usersService from "../services/users.services";

export const getPaginatedUsers = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = (req.query.search as string) || "";
  const offset = (page - 1) * limit;

  const data = await usersService.getPaginatedUsers(search, limit, offset);

  const total = await usersService.getPaginatedTotalUsers(search);

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
