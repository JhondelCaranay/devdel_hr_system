import { create } from "zustand";

type ModalState = {
  id?: number;
  isOpen: boolean;
  onOpenChange: (open: boolean, id?: number) => void;
};

export const createBaseModalStore = () =>
  create<ModalState>((set) => ({
    id: undefined,
    isOpen: false,
    onOpenChange: (open: boolean, id?: number) => set({ isOpen: open, id: id }),
  }));
