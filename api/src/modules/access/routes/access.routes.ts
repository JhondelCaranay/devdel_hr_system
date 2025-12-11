import { Router } from "express";
import * as accessController from "../controllers/access.controllers";
import { validate } from "@/middlewares/validate.middleware";
import * as accessChema from "../validators/access.validators";

const router = Router();

router.get("/", validate(accessChema.accessPaginatedSchema), accessController.getPaginatedAccess);
router.get("/show/:uuid", accessController.getAccess);
router.post("/store", validate(accessChema.storeAccesschema), accessController.storeAccess);
router.patch("/update/:uuid", validate(accessChema.updateAccesschema), accessController.updateAccess);
router.delete("/destroy/:uuid", accessController.destroyAccess);
router.patch("/restore/:uuid", accessController.restoreAccess);
router.get("/total", accessController.getTotalAccess);
router.get("/options", accessController.getAccessOptions);

export default router;
