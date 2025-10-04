import { type ReactNode } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";

type DrawerSize = "sm" | "md" | "lg" | "xl" | "full";

interface BaseDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: DrawerSize;
  side?: "left" | "right" | "bottom"; // control which side it comes from
  onClear: () => void;
}

export function BaseDrawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = "md",
  side = "bottom",
  onClear,
}: BaseDrawerProps) {
  // Map size prop to Tailwind classes
  const sizeClasses: Record<DrawerSize, string> = {
    sm: "min-w-[280px]",
    md: "min-[360px]",
    lg: "min-w-[480px]",
    xl: "min-w-[640px]",
    full: "min-w-[90vw] min-h-[90vh]", // full screen
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction={side}>
      <DrawerContent
        className={`${sizeClasses[size]} ${side === "bottom" ? "h-[70vh] w-full" : "self-center h-[90vh]"}`}
      >
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-5">{children}</div>
        <DrawerFooter>
          <Button variant="outline" onClick={onClear}>
            Clear
          </Button>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
