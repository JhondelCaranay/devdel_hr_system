import apiClient from "@/lib/axios";

export async function fetchAccessPaginated(page: number, search: string) {
  const { data } = await apiClient.get("/access", {
    params: {
      page,
      limit: 10,
      search,
    },
  });
  return data;
}
export const fetchAccessById = async (accessId: string) => {
  const { data } = await apiClient.get(`/access/show/${accessId}`);
  return data;
};

export async function fetchAccessOptions(roleId?: string) {
  const { data } = await apiClient.get(`/access/options`, {
    params: roleId ? { role_id: roleId } : {},
  });
  return data;
}
