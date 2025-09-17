import { Router } from "express";
import * as usersController from "../controllers/users.controllers";
import { validate } from "@/middlewares/validate.middleware";
import { usersPaginatedSchema } from "../validators/users.validators";

const router = Router();

router.get("/paginated", validate(usersPaginatedSchema), usersController.getPaginatedUsers);

export default router;
