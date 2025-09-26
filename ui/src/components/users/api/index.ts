import apiClient from "@/lib/axios";

export async function fetchUsersPaginated(page: number, search: string, role_uuid: string) {
  //wait  for 2 seconds
  await new Promise((resolve) => setTimeout(resolve, 2000));

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
