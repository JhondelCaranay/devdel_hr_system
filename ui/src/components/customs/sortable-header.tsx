import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { type Column } from "@tanstack/react-table";
import { cn } from "@/lib/utils";

type SortableHeaderProps<TData> = {
  column: Column<TData, unknown>;
  title: string;
  align: "left" | "center" | "right";
};

export function SortableHeader<TData>({ column, title, align = "left" }: SortableHeaderProps<TData>) {
  const sorted = column.getIsSorted(); // "asc" | "desc" | false

  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(sorted === "asc")}
      className={cn(
        "cursor-pointer w-full justify-start", // base
        align === "center" && "justify-center",
        align === "right" && "justify-end"
      )}
    >
      {title}
      {sorted === "asc" ? (
        <ArrowUp className="ml-2 h-4 w-4" />
      ) : sorted === "desc" ? (
        <ArrowDown className="ml-2 h-4 w-4" />
      ) : (
        <ArrowUpDown className="ml-2 h-4 w-4" />
      )}
    </Button>
  );
}
