import { Router } from "express";
import * as rolesController from "../controllers/roles.controllers";
import { validate } from "@/middlewares/validate.middleware";
import * as rolesChema from "../validators/roles.validators";

const router = Router();

router.get("/", validate(rolesChema.rolesPaginatedSchema), rolesController.getPaginatedRoles);
router.get("/show/:uuid", rolesController.getRole);
router.get("/show/:uuid/access", rolesController.getPaginatedRoleAccess);
router.post("/store", validate(rolesChema.storeRoleSchema), rolesController.storeRole);
router.patch("/update/:uuid", validate(rolesChema.storeRoleSchema), rolesController.updateRole);
router.patch(
  "/update/:uuid/copy-access",
  validate(rolesChema.copyRoleAccessSchema),
  rolesController.updateCopyRoleAccess
);
router.patch("/update/:uuid/add-access", validate(rolesChema.addRoleAccessSchema), rolesController.addRoleAccess);
router.delete("/destroy/:uuid", rolesController.destroyRole);
router.patch("/restore/:uuid", rolesController.restoreRole);
router.get("/total", rolesController.getTotalRoles);
router.get("/options", rolesController.getRoleOptions);

export default router;
