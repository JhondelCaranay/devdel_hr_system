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
import { useAuth } from "@/context/auth-context";
import { Permission } from "@/lib/constants/permissions";
import type { Access } from "@/types";
import { useConfirm } from "@/hooks/use-confirm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRoleAccess } from "@/components/roles/api";
import { toast } from "sonner";
import { Route as RoleDetailRoute } from "./../../../routes/(app)/dashboard/roles/$roleId";

export const RoleAccessColumnAction = ({ data }: { data: Access }) => {
  const { hasPermission } = useAuth();
  const { roleId } = RoleDetailRoute.useParams();
  const queryClient = useQueryClient();

  const canDeleteRoleAccess = hasPermission(Permission.ROLES_ACCESS_DELETE);

  const [DeleteRoleAccessDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this record. This action is permanent and cannot be undone."
  );

  const mutation = useMutation({
    mutationFn: deleteRoleAccess,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["access"] });
      toast.success("Data remove successfully");
    },
    onError: () => {
      toast.error("Failed to remove data. Please try again later.");
    },
  });

  const onDelete = async () => {
    const confirmed = await confirm();

    if (confirmed) {
      console.log(`role ${roleId} - access ${data.uuid}`);
      await mutation.mutateAsync({
        access_uuid: data.uuid,
        role_uuid: roleId,
      });
      console.log("🚀 ~ onDelete ~ confirmed:", confirmed);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <DeleteRoleAccessDialog />
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
          <DropdownMenuItem variant="destructive" disabled={!canDeleteRoleAccess} onClick={onDelete}>
            Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
