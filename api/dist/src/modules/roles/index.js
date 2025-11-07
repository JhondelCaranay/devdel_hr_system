"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const roles_routes_1 = __importDefault(require("./routes/roles.routes"));
exports.default = {
    routes: roles_routes_1.default,
};
