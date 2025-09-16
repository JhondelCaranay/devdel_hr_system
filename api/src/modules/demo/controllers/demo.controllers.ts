import { Request, Response } from "express";
import * as demoService from "../services/demo.services";

export const getDemos = async (req: Request, res: Response) => {
  const accessToken = req.cookies.accessToken; // ✅ correct way

  console.log({ accessToken });

  const demos = await demoService.getAllDemos();
  return res.status(200).json(demos);
};

export const addDemo = async (req: Request, res: Response) => {
  const newDemo = await demoService.createDemo(req.body);
  return res.status(201).json(newDemo);
};

export const updateDemo = async (req: Request, res: Response) => {
  const demoId = req.params.id;

  const demoExists = await demoService.findDemoById(demoId);

  if (!demoExists) {
    return res.status(404).json({ message: "Demo not found" });
  }

  const updatedDemo = await demoService.updateDemo(demoExists.id, req.body);
  return res.status(200).json(updatedDemo);
};

export const deleteDemo = async (req: Request, res: Response) => {
  const demoId = req.params.id;
  const demoExists = await demoService.findDemoById(demoId);

  if (!demoExists) {
    return res.status(404).json({ message: "Demo not found" });
  }

  const result = await demoService.deleteDemo(demoExists.id);
  return res.status(200).json(result);
};
