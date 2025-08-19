import { eq } from "drizzle-orm";
import { IDemoInsert, IDemoUpdate } from "../validators/demo.validators";
import { db } from "@/db";
import { demosTable } from "@/db/schema/demo";

export const getAllDemos = async () => {
  const demos = await db.select().from(demosTable);
  return demos;
};

export const findDemoById = async (id: string) => {
  const [demo] = await db.select().from(demosTable).where(eq(demosTable.uuid, id));
  return demo;
};

export const createDemo = async (data: IDemoInsert) => {
  const [demo] = await db.insert(demosTable).values(data).returning();
  return demo;
};

export const updateDemo = async (id: number, data: IDemoUpdate) => {
  const demo = await db.update(demosTable).set(data).where(eq(demosTable.id, id)).returning();
  return demo;
};

export const deleteDemo = async (id: number) => {
  const [demo] = await db.delete(demosTable).where(eq(demosTable.id, id)).returning();

  return demo;
};
