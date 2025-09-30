"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { SortableHeader } from "@/components/custom-ui/sortable-header";
import type { Access } from "@/types";
import { formatDate } from "@/lib/format";
import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<Access>[] = [
  {
    accessorKey: "code",
    header: ({ column }) => <SortableHeader column={column} title="Code" align="left" />,
  },
  {
    accessorKey: "label",
    header: ({ column }) => <SortableHeader column={column} title="Label" align="left" />,
  },
  {
    accessorKey: "module_name",
    header: ({ column }) => <SortableHeader column={column} title="Module Name" align="left" />,
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => <SortableHeader column={column} title="Created At" align="left" />,
    cell: ({ row }) => {
      const data = row.original;
      return <span>{formatDate(data.created_at)}</span>;
    },
  },
];

export const RoleAccessColumns: ColumnDef<Access>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    size: 20,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "code",
    header: ({ column }) => <SortableHeader column={column} title="Code" align="left" />,
  },
  {
    accessorKey: "label",
    header: ({ column }) => <SortableHeader column={column} title="Label" align="left" />,
  },
  {
    accessorKey: "module_name",
    header: ({ column }) => <SortableHeader column={column} title="Module Name" align="left" />,
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => <SortableHeader column={column} title="Created At" align="left" />,
    cell: ({ row }) => {
      const data = row.original;
      return <span>{formatDate(data.created_at)}</span>;
    },
  },
];
