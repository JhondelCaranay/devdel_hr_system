import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/context/auth-context";
import { Permission } from "@/lib/constants/permissions";
import type { Access } from "@/types";

export const AccessColumnAction = ({ data }: { data: Access }) => {
  const { hasPermission } = useAuth();
  const canViewDetail = hasPermission(Permission.ROLES_VIEW_DETAIL_PAGE);

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
          <DropdownMenuItem className="" disabled={!canViewDetail}>
            <Link to="/dashboard/access/$accessId" params={{ accessId: data.uuid }}>
              View Details
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
