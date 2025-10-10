import type { Role } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { useAuth } from "@/context/auth-context";
import { useEditRoleModal } from "../hooks/use-role-modal-store";
import { useConfirm } from "@/hooks/use-confirm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteRole } from "../api";
import { useNavigate } from "@tanstack/react-router";
import { Permission } from "@/lib/constants/permissions";

type Props = {
  data?: Role & { total_users: string };
};

export const RoleDetails = ({ data }: Props) => {
  const queryClient = useQueryClient();
  const { hasPermission } = useAuth();
  const editRoleModal = useEditRoleModal();
  const navigate = useNavigate();

  const [DeleteRoleConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this record. This action is permanent and cannot be undone."
  );

  const mutation = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Data updated successfully");
      editRoleModal.onOpenChange(false);
    },
    onError: () => {
      toast.error("Failed to update data. Please try again later.");
    },
  });

  const onDeleteRole = async () => {
    const ok = await confirm();
    if (ok && data) {
      console.log("deleted");
      await mutation.mutateAsync(data.uuid);
      navigate({
        to: "/dashboard/roles",
        replace: true,
      });
    } else {
      console.log("cancel");
    }
  };

  const canEditRole = hasPermission(Permission.ROLES_EDIT);
  const canDeleteRole = hasPermission(Permission.ROLES_EDIT);

  if (!data) {
    return <RoleDetailSkeleton />;
  }

  return (
    <Card className="mb-6 shadow-md">
      <CardHeader className="">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">Role Details</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant={"outline"}
              className="text-sm font-medium"
              disabled={!canEditRole}
              onClick={() => editRoleModal.onOpenChange(true, data.uuid)}
            >
              Edit
            </Button>
            <Button
              variant={"destructive"}
              className="text-sm font-medium"
              disabled={!canDeleteRole}
              onClick={onDeleteRole}
            >
              Delete
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="space-x-1">
            <span className="font-semibold text-gray-700">Name:</span> <span>{data.name}</span>
          </div>
          <div className="space-x-1">
            <span className="font-semibold text-gray-700">Description:</span> <span>{data.description || "N/A"}</span>
          </div>
          <div className="space-x-1">
            <span className="font-semibold text-gray-700">Total Users:</span>{" "}
            <span>{data.total_users || "0 Users"}</span>
          </div>
          <div className="space-x-1">
            <span className="font-semibold text-gray-700">Created At:</span> <span>{formatDate(data.created_at)}</span>
          </div>
          <div className="space-x-1">
            <span className="font-semibold text-gray-700">Updated At:</span> <span>{formatDate(data.updated_at)}</span>
          </div>
        </div>
        <DeleteRoleConfirmDialog />
      </CardContent>
    </Card>
  );
};

export const RoleDetailSkeleton = () => {
  return (
    <Card className="mb-6 shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-32" />
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Skeleton className="h-5 w-1/4" />
          <Skeleton className="h-5 w-1/4" />
          <Skeleton className="h-5 w-1/4" />
          <Skeleton className="h-5 w-1/4" />
        </div>
      </CardContent>
    </Card>
  );
};
