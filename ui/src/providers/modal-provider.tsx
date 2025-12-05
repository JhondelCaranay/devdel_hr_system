import {
  useAddRoleAccessModal,
  useCopyExistingAccessModal,
  useCreateRoleModal,
  useEditRoleModal,
} from "@/components/roles/hooks/use-role-modal-store";
import AddRoleAccessModal from "@/components/roles/ui/modals/add-role-access-modal";
import CopyExistingAccessModal from "@/components/roles/ui/modals/copy-existing-access-modal";
import CreateRoleModal from "@/components/roles/ui/modals/create-role-modal";
import EditRoleModal from "@/components/roles/ui/modals/edit-role-modal";

const ModalProvider = () => {
  const createRoleModal = useCreateRoleModal();
  const editRoleModal = useEditRoleModal();
  const copyExistingAccessModal = useCopyExistingAccessModal();
  const addRoleAccessModal = useAddRoleAccessModal();

  if (createRoleModal.isOpen) return <CreateRoleModal />;
  if (editRoleModal.isOpen) return <EditRoleModal />;
  if (copyExistingAccessModal.isOpen) return <CopyExistingAccessModal />;
  if (addRoleAccessModal.isOpen) return <AddRoleAccessModal />;
};

export default ModalProvider;
