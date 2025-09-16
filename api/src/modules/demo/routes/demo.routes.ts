import { Router } from "express";
import * as demoController from "./../controllers/demo.controllers";
import { validate } from "@/middlewares/validate.middleware";
import { demoInsertSchema, demoUpdateSchema } from "../validators/demo.validators";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, demoController.getDemos);
router.post("/", validate(demoInsertSchema), demoController.addDemo);
router.put("/:id", validate(demoUpdateSchema), demoController.updateDemo);
router.delete("/:id", demoController.deleteDemo);

export default router;
