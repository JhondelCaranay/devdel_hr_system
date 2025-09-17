import z from "zod";

export const usersPaginatedSchema = z.object({
  // body: z.object({
  //   name: z.string("name is required").min(1, "name should not be empty"),
  // }),
  query: z.object({
    page: z.coerce.number("page must be a number").optional(),
    search: z.string().optional(),
    limit: z.coerce.number("limit must be a numbe").optional(),
  }),
});

// export type IUserPaginatedBodySchema = z.infer<typeof usersPaginatedSchema>["body"];
// export type IUserPaginatedQuerySchema = z.infer<typeof usersPaginatedSchema>["query"];
