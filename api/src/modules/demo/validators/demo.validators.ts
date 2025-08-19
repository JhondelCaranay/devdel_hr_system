import z from "zod";

export const demoInsertSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export const demoUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
});

export type IDemoInsert = z.infer<typeof demoInsertSchema>;
export type IDemoUpdate = z.infer<typeof demoUpdateSchema>;
