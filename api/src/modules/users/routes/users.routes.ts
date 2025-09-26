import { Router } from "express";
import * as usersController from "../controllers/users.controllers";
import { validate } from "@/middlewares/validate.middleware";
import { usersPaginatedSchema } from "../validators/users.validators";

const router = Router();

router.get("/", validate(usersPaginatedSchema), usersController.getPaginatedUsers);
router.get("/options", usersController.getUserOptions);

export default router;
