import { Router } from "express";
import * as authController from "./../controllers/auth.controllers";
import { validator } from "@/middlewares/validate.middleware";
import { loginSchema, registerSchema } from "../validators/auth.validators";
import { authenticate, authenticateRefreshToken } from "@/middlewares/auth.middleware";
import { permission } from "@/middlewares/permission.middleware";

const router = Router();

router.post(
  "/register",
  validator({
    body: registerSchema,
  }),
  authController.register
);

router.post(
  "/login",
  validator({
    body: loginSchema,
  }),
  authController.login
);

router.post("/logout", authenticate, authController.logout);

router.post("/refresh-token", authenticateRefreshToken, authController.refreshToken);

router.get("/me", authenticate, permission("post:create_post"), authController.getMe);

router.get("/my-permissions", authenticate, authController.getMyAccess);

export default router;
