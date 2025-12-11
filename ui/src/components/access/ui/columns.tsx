"use client";

import { type ColumnDef } from "@tanstack/react-table";
import type { Access } from "@/types";
import { SortableHeader } from "@/components/custom-ui/sortable-header";
import { formatDate } from "@/lib/format";
import { AccessColumnAction } from "./column-action";

export const accessColumns: ColumnDef<Access>[] = [
  {
    accessorKey: "code",
    header: ({ column }) => <SortableHeader column={column} title="Code" align="left" />,
  },
  {
    accessorKey: "label",
    header: ({ column }) => <SortableHeader column={column} title="Label" align="left" />,
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
      return <AccessColumnAction data={data} />;
    },
  },
];
