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
exports.restoreRole = exports.destroyRole = exports.updateCopyRoleAccess = exports.updateRole = exports.storeRole = exports.getRole = exports.getRoleOptions = exports.getTotalRoles = exports.getPaginatedRoleAccess = exports.getPaginatedRoles = void 0;
const rolesService = __importStar(require("../services/roles.services"));
const rolesAccessService = __importStar(require("../services/roles-access.services"));
const getPaginatedRoles = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const offset = (page - 1) * limit;
    const data = await rolesService.getPaginatedRoles(search, limit, offset);
    const total = await rolesService.getPaginatedTotalRoles(search);
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
exports.getPaginatedRoles = getPaginatedRoles;
const getPaginatedRoleAccess = async (req, res) => {
    const { uuid } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const offset = (page - 1) * limit;
    const role = await rolesService.getRoleByUUID(uuid);
    if (!role) {
        return res.status(404).json({ message: "Role not found" });
    }
    const data = await rolesAccessService.getPaginatedRoleAccess(role.id, search, limit, offset);
    const total = await rolesAccessService.getPaginatedTotalRoleAccess(role.id, search);
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
exports.getPaginatedRoleAccess = getPaginatedRoleAccess;
const getTotalRoles = async (req, res) => {
    const total = await rolesService.getTotalRoles();
    return res.json({ total });
};
exports.getTotalRoles = getTotalRoles;
const getRoleOptions = async (req, res) => {
    const data = await rolesService.getRoleOptions();
    return res.json(data);
};
exports.getRoleOptions = getRoleOptions;
const getRole = async (req, res) => {
    const { uuid } = req.params;
    const role = await rolesService.getRoleByUUID(uuid);
    if (!role) {
        return res.status(404).json({ message: "Role not found" });
    }
    const detailedRole = await rolesService.GetRoleDetailsById(role.id);
    return res.status(200).json({ data: detailedRole });
};
exports.getRole = getRole;
const storeRole = async (req, res) => {
    const { name, description } = req.body;
    const existingRole = await rolesService.getRoleByName(name);
    if (existingRole) {
        return res.status(400).json({ message: "Role name already exists" });
    }
    const data = await rolesService.createRole({ name, description });
    return res.status(201).json({ data });
};
exports.storeRole = storeRole;
const updateRole = async (req, res) => {
    const { uuid } = req.params;
    const { name, description } = req.body;
    const existingRole = await rolesService.getRoleByUUID(uuid);
    if (!existingRole) {
        return res.status(404).json({ message: "Role not found" });
    }
    const data = await rolesService.updateRole(existingRole.id, { name, description });
    return res.status(200).json({ data });
};
exports.updateRole = updateRole;
const updateCopyRoleAccess = async (req, res) => {
    const { uuid: copy_to_uuid } = req.params;
    const { copy_from_uuid } = req.body;
    // get both roles
    const copyFromData = await rolesService.getRoleByUUID(copy_from_uuid);
    if (!copyFromData) {
        return res.status(404).json({ message: "Role not found" });
    }
    const copyToData = await rolesService.getRoleByUUID(copy_to_uuid);
    if (!copyToData) {
        return res.status(404).json({ message: "Role not found" });
    }
    // clear existing access
    await rolesAccessService.deleteRoleAccessByRoleId(copyToData.id);
    // fetch access from source
    const fromAccess = await rolesAccessService.getRoleAccessByRoleId(copyFromData.id);
    if (fromAccess.length === 0) {
        return res.status(200).json({
            message: "Source role has no access to copy",
            copied: 0,
        });
    }
    // insert into target
    const inserted = await rolesAccessService.createRoleAccessForRole(copyToData.id, fromAccess.map((a) => a.access_id));
    return res.status(200).json({
        message: "Role access copied successfully",
        data: `Inserted access ${inserted.length}`,
    });
};
exports.updateCopyRoleAccess = updateCopyRoleAccess;
const destroyRole = async (req, res) => {
    const { uuid } = req.params;
    const existingRole = await rolesService.getRoleByUUID(uuid);
    if (!existingRole) {
        return res.status(404).json({ message: "Role not found" });
    }
    const data = await rolesService.deleteRole(existingRole.id);
    return res.status(200).json({ data });
};
exports.destroyRole = destroyRole;
const restoreRole = async (req, res) => {
    const { uuid } = req.params;
    const existingRole = await rolesService.getRoleByUUID(uuid);
    if (!existingRole) {
        return res.status(404).json({ message: "Role not found" });
    }
    const data = await rolesService.restoreRole(existingRole.id);
    return res.status(200).json({ data });
};
exports.restoreRole = restoreRole;
