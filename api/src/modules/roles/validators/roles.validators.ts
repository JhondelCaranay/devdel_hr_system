import z from "zod";

export const rolesPaginatedSchema = z.object({
  query: z.object({
    page: z.coerce.number("page must be a number").optional(),
    search: z.string().optional(),
    limit: z.coerce.number("limit must be a numbe").optional(),
  }),
});

export const storeRoleSchema = z.object({
  body: z.object({
    name: z
      .string("Name is required")
      .min(1, "Name must be at least 1 character")
      .max(50, "Name must be at most 50 characters"),
    description: z.string().max(255, "Description must be at most 255 characters").optional(),
  }),
});

export const copyRoleAccessSchema = z.object({
  body: z.object({
    copy_from_uuid: z.string("copy_from_uuid is required"),
  }),
});
