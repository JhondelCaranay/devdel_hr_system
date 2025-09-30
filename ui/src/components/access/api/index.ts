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

// export const fetchRoleById = async (roleId: string) => {
//   const { data } = await apiClient.get(`/access/show/${roleId}`);
//   return data;
// };

// export async function fetchRoleOptions() {
//   const { data } = await apiClient.get("/access/options");
//   return data;
// }
