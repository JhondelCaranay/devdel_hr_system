"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const demo_1 = __importDefault(require("./modules/demo"));
const auth_1 = __importDefault(require("./modules/auth"));
const users_1 = __importDefault(require("./modules/users"));
const roles_1 = __importDefault(require("./modules/roles"));
const access_1 = __importDefault(require("./modules/access"));
const auth_middleware_1 = require("./middlewares/auth.middleware");
const apiRouter = (0, express_1.Router)();
// Grouped routes under /api
apiRouter.use("/demos", demo_1.default.routes);
apiRouter.use("/users", auth_middleware_1.authenticate, users_1.default.routes);
apiRouter.use("/roles", auth_middleware_1.authenticate, roles_1.default.routes);
apiRouter.use("/access", auth_middleware_1.authenticate, access_1.default.routes);
apiRouter.use("/auth", auth_1.default.routes);
exports.default = apiRouter;
