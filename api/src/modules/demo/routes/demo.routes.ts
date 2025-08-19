import { Router } from "express";
import * as demoController from "./../controllers/demo.controllers";
import { validate } from "@/middlewares/validate";
import { demoInsertSchema, demoUpdateSchema } from "../validators/demo.validators";

const router = Router();

router.get("/", demoController.getDemos);
router.post("/", validate(demoInsertSchema), demoController.addDemo);
router.put("/:id", validate(demoUpdateSchema), demoController.updateDemo);
router.delete("/:id", demoController.deleteDemo);

export default router;
