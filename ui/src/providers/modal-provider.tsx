import { useCopyExistingAccessModal, useCreateRoleModal } from "@/components/roles/hooks/use-role-modal-store";
import CopyExistingAccessModal from "@/components/roles/ui/modals/copy-existing-access-modal";
import CreateRoleModal from "@/components/roles/ui/modals/create-role-modal";

const ModalProvider = () => {
  const createRoleModal = useCreateRoleModal();
  const copyExistingAccessModal = useCopyExistingAccessModal();

  if (createRoleModal.isOpen) {
    return <CreateRoleModal />;
  }
  if (copyExistingAccessModal.isOpen) {
    return <CopyExistingAccessModal />;
  }
};

export default ModalProvider;
