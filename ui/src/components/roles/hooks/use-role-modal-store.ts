import { createBaseModalStore } from "@/hooks/use-create-base-modal-store";

export const useCreateRoleModal = createBaseModalStore();
export const useEditRoleModal = createBaseModalStore();
export const useCopyExistingAccessModal = createBaseModalStore();
export const useAddRoleAccessModal = createBaseModalStore();
