import apiClient from "@/lib/axios";

export async function fetchUsersPaginated(page: number, search: string) {
  const { data } = await apiClient.get("/users/paginated", {
    params: {
      page,
      limit: 10,
      search,
    },
  });
  return data;
}
