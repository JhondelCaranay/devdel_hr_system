import { Router } from "express";
import demo from "./modules/demo";
import auth from "./modules/auth";

const apiRouter = Router();

// Grouped routes under /api
apiRouter.use("/demos", demo.routes);
apiRouter.use("/auth", auth.routes);

export default apiRouter;
