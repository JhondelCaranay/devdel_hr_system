import { Router } from "express";
import demo from "./modules/demo";
import auth from "./modules/auth";
import users from "./modules/users";
import { authenticate } from "./middlewares/auth.middleware";

const apiRouter = Router();

// Grouped routes under /api
apiRouter.use("/demos", demo.routes);
apiRouter.use("/users", authenticate, users.routes);
apiRouter.use("/auth", auth.routes);

export default apiRouter;
