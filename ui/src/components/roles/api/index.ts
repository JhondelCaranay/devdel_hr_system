import apiClient from "@/lib/axios";
import type { AddRoleAccessFormValues, CreateRoleFormValues, EditRoleFormValues, ExistingAccessFormValues, RemoveRoleAccessFormValues } from "../schema";

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
  const { data } = await apiClient.post("/roles/store", role);
  return data;
};

export const editRole = async (role: EditRoleFormValues) => {
  const { uuid, ...rest } = role;
  const { data } = await apiClient.patch(`/roles/update/${uuid}`, rest);
  return data;
};

export const copyExistingAccess = async (role: ExistingAccessFormValues) => {
  const { copy_to_uuid, ...rest } = role;
  const { data } = await apiClient.patch(`/roles/update/${copy_to_uuid}/copy-access`, rest);
  return data;
};

export const addRoleAccess = async (role: AddRoleAccessFormValues) => {
  const { data } = await apiClient.patch(`/roles/update/${role.role_uuid}/add-access`, {
    access_uuid: role.access_uuid,
  });
  return data;
};

export const deleteRoleAccess = async (role: RemoveRoleAccessFormValues) => {
  const { data } = await apiClient.patch(`/roles/update/${role.role_uuid}/remove-access`, {
    access_uuid: role.access_uuid,
  });
  return data;
};

export const deleteRole = async (uuid: string) => {
  const { data } = await apiClient.delete(`/roles/destroy/${uuid}`);
  return data;
};
