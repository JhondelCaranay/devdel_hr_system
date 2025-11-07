"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const env_1 = require("../config/env");
const node_postgres_1 = require("drizzle-orm/node-postgres");
exports.db = (0, node_postgres_1.drizzle)(env_1.ENV.DATABASE_URL);
