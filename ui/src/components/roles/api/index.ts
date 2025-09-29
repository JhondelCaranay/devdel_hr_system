import apiClient from "@/lib/axios";

export async function fetchRolesPaginated(page: number, search: string) {
  const { data } = await apiClient.get("/roles", {
    params: {
      page,
      limit: 10,
      search,
    },
  });
  return data;
}

export async function fetchRoleOptions() {
  const { data } = await apiClient.get("/roles/options");
  return data;
}
