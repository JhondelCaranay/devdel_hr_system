import { create } from "zustand";

type UseCopyExistingAccessModal = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export const UseCopyExistingAccessModal = create<UseCopyExistingAccessModal>((set) => ({
  isOpen: false,
  onOpenChange: (open: boolean) => set({ isOpen: open }),
}));
