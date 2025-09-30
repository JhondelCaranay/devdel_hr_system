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

export const fetchRoleById = async (roleId: string) => {
  const { data } = await apiClient.get(`/roles/show/${roleId}`);
  return data;
};

export async function fetchRoleOptions() {
  const { data } = await apiClient.get("/roles/options");
  return data;
}
