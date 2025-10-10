"use client";

import { type ColumnDef } from "@tanstack/react-table";
import type { Role } from "@/types";
import { SortableHeader } from "@/components/custom-ui/sortable-header";
import { formatDate } from "@/lib/format";
import { ColumnAction } from "./column-action";

export const columns: ColumnDef<Role>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column} title="System Role" align="left" />,
  },
  {
    accessorKey: "description",
    header: ({ column }) => <SortableHeader column={column} title="Description" align="left" />,
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => <SortableHeader column={column} title="Created At" align="left" />,
    cell: ({ row }) => {
      const data = row.original;
      return <span>{formatDate(data.created_at)}</span>;
    },
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => <SortableHeader column={column} title="Updated At" align="left" />,
    cell: ({ row }) => {
      const data = row.original;
      return <span>{formatDate(data.updated_at)}</span>;
    },
  },
  {
    id: "actions",
    size: 50,
    minSize: 50,
    cell: ({ row }) => {
      const data = row.original;
      return <ColumnAction data={data} />;
    },
  },
];
