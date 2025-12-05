import apiClient from "@/lib/axios";

export async function fetchUsersPaginated(page: number, search: string, role_uuid: string) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const { data } = await apiClient.get("/users", {
    params: {
      page,
      limit: 10,
      search,
      role_uuid,
    },
  });
  return data;
}
