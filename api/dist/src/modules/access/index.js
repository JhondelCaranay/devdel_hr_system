"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const access_routes_1 = __importDefault(require("./routes/access.routes"));
exports.default = {
    routes: access_routes_1.default,
};
