import z from "zod";

export const createRoleSchema = z.object({
  name: z.string("Name is required").min(1, "Name must be at least 1 characters"),
  description: z.string("Description is required").min(1, "Description must be at least 1 characters"),
});
export type CreateRoleFormValues = z.infer<typeof createRoleSchema>;

export const editRoleSchema = z.object({
  uuid: z.string("UUID is required"),
  name: z.string("Name is required").min(1, "Name must be at least 1 characters"),
  description: z.string("Description is required").min(1, "Description must be at least 1 characters"),
});
export type EditRoleFormValues = z.infer<typeof editRoleSchema>;

export const CopyExistingAccessSchema = z.object({
  copy_from_uuid: z.string("UUID is required"),
  copy_to_uuid: z.string("UUID is required"),
});
export type ExistingAccessFormValues = z.infer<typeof CopyExistingAccessSchema>;
