import z from "zod";

export const createRoleSchema = z.object({
  name: z.string("Name is required").min(1, "Name must be at least 1 characters"),
  description: z.string("Description is required").min(1, "Description must be at least 1 characters"),
});

export type CreateRoleFormValues = z.infer<typeof createRoleSchema>;
