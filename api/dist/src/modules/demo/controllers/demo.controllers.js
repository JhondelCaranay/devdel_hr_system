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
exports.deleteDemo = exports.updateDemo = exports.addDemo = exports.getDemos = void 0;
const demoService = __importStar(require("../services/demo.services"));
const getDemos = async (req, res) => {
    const accessToken = req.cookies.accessToken; // ✅ correct way
    const demos = await demoService.getAllDemos();
    return res.status(200).json(demos);
};
exports.getDemos = getDemos;
const addDemo = async (req, res) => {
    const newDemo = await demoService.createDemo(req.body);
    return res.status(201).json(newDemo);
};
exports.addDemo = addDemo;
const updateDemo = async (req, res) => {
    const demoId = req.params.id;
    const demoExists = await demoService.findDemoById(demoId);
    if (!demoExists) {
        return res.status(404).json({ message: "Demo not found" });
    }
    const updatedDemo = await demoService.updateDemo(demoExists.id, req.body);
    return res.status(200).json(updatedDemo);
};
exports.updateDemo = updateDemo;
const deleteDemo = async (req, res) => {
    const demoId = req.params.id;
    const demoExists = await demoService.findDemoById(demoId);
    if (!demoExists) {
        return res.status(404).json({ message: "Demo not found" });
    }
    const result = await demoService.deleteDemo(demoExists.id);
    return res.status(200).json(result);
};
exports.deleteDemo = deleteDemo;
