"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SortableHeader } from "@/components/custom-ui/sortable-header";
import type { Role } from "@/types";
import { formatDate } from "@/lib/format";
import { Link } from "@tanstack/react-router";
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

      return (
        <div className="flex justify-center items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="bg-blue-500/30 text-slate-900 cursor-pointer">
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(data.uuid)}>Copy ID</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/dashboard/roles/$roleId" params={{ roleId: data.uuid }}>
                  View Details
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
