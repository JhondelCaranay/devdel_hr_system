import { Router } from "express";
import * as authController from "./../controllers/auth.controllers";
import { validate } from "@/middlewares/validate";
import { loginSchema, registerSchema } from "../validators/auth.validators";

const router = Router();

router.get("/register", validate(registerSchema), authController.register);
router.get("/login", validate(loginSchema), authController.login);
router.get("/me", authController.getMe);

export default router;
