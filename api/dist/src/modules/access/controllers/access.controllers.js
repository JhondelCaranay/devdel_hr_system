"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreRole = exports.destroyRole = exports.updateRole = exports.storeRole = exports.getTotalaccess = exports.getPaginatedaccess = void 0;
const accessService = __importStar(require("../services/access.services"));
const getPaginatedaccess = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const offset = (page - 1) * limit;
    const data = await accessService.getPaginatedaccess(search, limit, offset);
    const total = await accessService.getPaginatedTotalaccess(search);
    return res.json({
        data: data,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    });
};
exports.getPaginatedaccess = getPaginatedaccess;
const getTotalaccess = async (req, res) => {
    const total = await accessService.getTotalaccess();
    return res.json({ total });
};
exports.getTotalaccess = getTotalaccess;
const storeRole = async (req, res) => {
    const { code, label, module_id } = req.body;
    const existingRole = await accessService.getAccessByCode(code);
    if (existingRole) {
        return res.status(400).json({ message: "Role code already exists" });
    }
    const data = await accessService.createAccess({ code, label, module_id });
    return res.status(201).json(data);
};
exports.storeRole = storeRole;
const updateRole = async (req, res) => {
    const { uuid } = req.params;
    const { code, label, module_id } = req.body;
    const existingRole = await accessService.getRoleByUUID(uuid);
    if (!existingRole) {
        return res.status(404).json({ message: "Role not found" });
    }
    const data = await accessService.updateRole(existingRole.id, { code, label, module_id });
    return res.status(200).json(data);
};
exports.updateRole = updateRole;
const destroyRole = async (req, res) => {
    const { uuid } = req.params;
    const existingRole = await accessService.getRoleByUUID(uuid);
    if (!existingRole) {
        return res.status(404).json({ message: "Role not found" });
    }
    const data = await accessService.deleteRole(existingRole.id);
    return res.status(200).json(data);
};
exports.destroyRole = destroyRole;
const restoreRole = async (req, res) => {
    const { uuid } = req.params;
    const existingRole = await accessService.getRoleByUUID(uuid);
    if (!existingRole) {
        return res.status(404).json({ message: "Role not found" });
    }
    const data = await accessService.restoreRole(existingRole.id);
    return res.status(200).json({ data });
};
exports.restoreRole = restoreRole;
