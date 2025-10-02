import apiClient from "@/lib/axios";
import type { CreateRoleFormValues } from "../schema";

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

export async function fetchRoleAccessPaginated(page: number, search: string, roleId?: string) {
  const { data } = await apiClient.get(`/roles/show/${roleId}/access`, {
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

export const createRole = async (role: CreateRoleFormValues) => {
  // // simulate 3 sec delay
  // await new Promise((resolve) => setTimeout(resolve, 1000));

  // // pretend response (mock)
  // return {
  //   id: Date.now(), // fake id
  //   ...role,
  // };

  const { data } = await apiClient.post("/roles/store", role);
  return data;
};
