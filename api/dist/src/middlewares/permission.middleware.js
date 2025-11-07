"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasAnyPermission = exports.hasAllPermission = exports.permission = void 0;
const auth_services_1 = require("@/modules/auth/services/auth.services");
// ✅ Single permission check
const permission = (permission) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const userAccess = await (0, auth_services_1.getUserAccess)(req.user.userId);
        const accessCodes = userAccess.map((a) => a.code);
        if (!accessCodes.includes(permission)) {
            return res.status(403).json({ message: "Insufficient rights" });
        }
        next();
    };
};
exports.permission = permission;
// ✅ Must have ALL permissions
const hasAllPermission = (permissions) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const userAccess = await (0, auth_services_1.getUserAccess)(req.user.userId);
        const accessCodes = userAccess.map((a) => a.code);
        const hasAll = permissions.every((perm) => accessCodes.includes(perm));
        if (!hasAll) {
            return res.status(403).json({ message: "Insufficient rights" });
        }
        next();
    };
};
exports.hasAllPermission = hasAllPermission;
// ✅ Must have AT LEAST ONE permission
const hasAnyPermission = (permissions) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const userAccess = await (0, auth_services_1.getUserAccess)(req.user.userId);
        const accessCodes = userAccess.map((a) => a.code);
        const hasAny = permissions.some((perm) => accessCodes.includes(perm));
        if (!hasAny) {
            return res.status(403).json({ message: "Insufficient rights" });
        }
        next();
    };
};
exports.hasAnyPermission = hasAnyPermission;
