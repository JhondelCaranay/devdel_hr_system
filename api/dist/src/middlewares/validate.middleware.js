"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validator = exports.validate = void 0;
const zod_1 = require("zod");
const validate = (schema) => (req, res, next) => {
    try {
        const result = schema.safeParse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        if (!result.success) {
            return res.status(400).json(result.error.flatten().fieldErrors);
        }
        // // override with parsed + coerced values
        // if (result.data.body) req.body = result.data.body;
        // if (result.data.query) Object.assign(req.query, result.data);
        // if (result.data.params) Object.assign(req.params, result.data);
        next();
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            return res.status(400).json(err.flatten().fieldErrors);
        }
        next(err);
    }
};
exports.validate = validate;
const validator = (schemas) => (req, res, next) => {
    try {
        // validate body if schema provided
        if (schemas.body) {
            const result = schemas.body.safeParse(req.body);
            if (!result.success) {
                return res.status(400).json(result.error.flatten().fieldErrors);
            }
            req.body = result.data;
        }
        // validate query if schema provided
        if (schemas.query) {
            const result = schemas.query.safeParse(req.query);
            if (!result.success) {
                return res.status(400).json(result.error.flatten().fieldErrors);
            }
            Object.assign(req.query, result.data);
        }
        // validate params if schema provided
        if (schemas.params) {
            const result = schemas.params.safeParse(req.params);
            if (!result.success) {
                return res.status(400).json(result.error.flatten().fieldErrors);
            }
            Object.assign(req.params, result.data);
        }
        next();
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            return res.status(400).json(err.flatten().fieldErrors);
        }
        next(err);
    }
};
exports.validator = validator;
