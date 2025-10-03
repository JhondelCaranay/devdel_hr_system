import { create } from "zustand";

type ModalState = {
  uuid?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean, uuid?: string) => void;
};

export const createBaseModalStore = () =>
  create<ModalState>((set) => ({
    uuid: undefined,
    isOpen: false,
    onOpenChange: (open: boolean, uuid?: string) => set({ isOpen: open, uuid: uuid }),
  }));
