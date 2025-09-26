import apiClient from "@/lib/axios";

export async function fetchRoleOptions() {
  const { data } = await apiClient.get("/roles/options");
  return data;
}
