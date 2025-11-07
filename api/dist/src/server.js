"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const api_routes_1 = __importDefault(require("./api-routes"));
const env_1 = require("./config/env");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const cors_2 = require("./config/cors");
const app = (0, express_1.default)();
const PORT = env_1.ENV.PORT;
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, cors_1.default)(cors_2.corsOptions));
// Routes
app.get("/", (req, res) => {
    res.send("WELCOME TO PROJECT DELDEV HR SYSTEM API!🚀");
});
app.use("/api", api_routes_1.default);
// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
