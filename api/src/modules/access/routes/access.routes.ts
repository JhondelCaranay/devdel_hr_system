import { Router } from "express";
import * as accessController from "../controllers/access.controllers";
import { validate } from "@/middlewares/validate.middleware";
import * as accessChema from "../validators/access.validators";

const router = Router();

router.get("/", validate(accessChema.accessPaginatedSchema), accessController.getPaginatedaccess);
router.post("/store", validate(accessChema.storeAccesschema), accessController.storeRole);
router.patch("/update/:uuid", validate(accessChema.updateAccesschema), accessController.updateRole);
router.delete("/destroy/:uuid", accessController.destroyRole);
router.patch("/restore/:uuid", accessController.restoreRole);
router.get("/total", accessController.getTotalaccess);
router.get("/options", accessController.getAccessOptions);

export default router;
