import z from "zod";

export const usersPaginatedSchema = z.object({
  query: z.object({
    page: z.coerce.number("page must be a number").optional(),
    search: z.string().optional(),
    limit: z.coerce.number("limit must be a number").optional(),
    role_uuid: z.string().optional(),
  }),
});

// export type IUserPaginatedBodySchema = z.infer<typeof usersPaginatedSchema>["body"];
