import apiClient from "@/lib/axios";

export async function fetchUsersPaginated(page: number, search: string, role_uuid: string) {
  const { data } = await apiClient.get("/users", {
    params: {
      page,
      limit: 2,
      search,
      role_uuid,
    },
  });
  return data;
}
