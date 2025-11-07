"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDemo = exports.updateDemo = exports.createDemo = exports.findDemoById = exports.getAllDemos = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("@/db");
const demo_1 = require("@/db/schema/demo");
const getAllDemos = async () => {
    const demos = await db_1.db.select().from(demo_1.demosTable);
    return demos;
};
exports.getAllDemos = getAllDemos;
const findDemoById = async (id) => {
    const [demo] = await db_1.db.select().from(demo_1.demosTable).where((0, drizzle_orm_1.eq)(demo_1.demosTable.uuid, id));
    return demo;
};
exports.findDemoById = findDemoById;
const createDemo = async (data) => {
    const [demo] = await db_1.db.insert(demo_1.demosTable).values(data).returning();
    return demo;
};
exports.createDemo = createDemo;
const updateDemo = async (id, data) => {
    const demo = await db_1.db.update(demo_1.demosTable).set(data).where((0, drizzle_orm_1.eq)(demo_1.demosTable.id, id)).returning();
    return demo;
};
exports.updateDemo = updateDemo;
const deleteDemo = async (id) => {
    const [demo] = await db_1.db.delete(demo_1.demosTable).where((0, drizzle_orm_1.eq)(demo_1.demosTable.id, id)).returning();
    return demo;
};
exports.deleteDemo = deleteDemo;
