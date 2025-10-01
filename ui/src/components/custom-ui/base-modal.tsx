import { type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

interface BaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
}

export function BaseModal({
  open = false,
  onOpenChange,
  title,
  description = "",
  children,
  footer,
  size = "md",
}: BaseModalProps) {
  // Map size prop to Tailwind classes
  const sizeClasses: Record<ModalSize, string> = {
    sm: "sm:max-w-[360px] w-[90%]",
    md: "sm:max-w-[425px] w-[90%]",
    lg: "sm:max-w-[640px] w-[95%]",
    xl: "sm:max-w-[768px] w-[95%]",
    full: "sm:max-w-[100%] w-full h-full sm:h-auto", // full width on desktop too
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="py-2">{children}</div>

        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
