import z from "zod";

export const accessPaginatedSchema = z.object({
  query: z.object({
    page: z.coerce.number("page must be a number").optional(),
    search: z.string().optional(),
    limit: z.coerce.number("limit must be a numbe").optional(),
  }),
});

export const storeAccesschema = z.object({
  body: z.object({
    code: z.string("Code is required").min(1, "Code must be at least 1 character").max(50, "Code must be at most 50 characters"),
    label: z.string("Label is required").min(1, "Label must be at least 1 character").max(100, "Label must be at most 100 characters"),
    module_id: z.number("Module ID must be a number").int("Module ID must be an integer"),
  }),
});

export const updateAccesschema = z.object({
  body: z.object({
    code: z.string("Code is required").optional(),
    label: z.string("Label is required").optional(),
    module_id: z.number("Module ID must be a number").optional(),
  }),
});

export type IStoreAccess = z.infer<typeof storeAccesschema>["body"];
export type IUpdateAccess = z.infer<typeof updateAccesschema>["body"];
