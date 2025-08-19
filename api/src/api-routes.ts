import { Router } from "express";
import demo from "./modules/demo";

const apiRouter = Router();

// Grouped routes under /api
apiRouter.use("/demos", demo.routes);
// apiRouter.use("/posts", postRoutes);

export default apiRouter;
