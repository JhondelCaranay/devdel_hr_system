import type { Role } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { useAuth } from "@/context/auth-context";

type Props = {
  data: Role & { total_users: string };
  isloading: boolean;
};

export const RoleDetails = ({ data }: Props) => {
  const { hasPermission } = useAuth();

  const canEditRole = hasPermission("roles:edit_roles");
  const canDeleteRole = hasPermission("roles:delete_roles");

  return (
    <Card className="mb-6 shadow-md">
      <CardHeader className="">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">Role Details</CardTitle>
          <div className="flex space-x-2">
            <Button variant={"outline"} className="text-sm font-medium" disabled={!canEditRole}>
              Edit
            </Button>
            <Button variant={"destructive"} className="text-sm font-medium" disabled={!canDeleteRole}>
              Delete
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium text-gray-700">Name:</span> <span>{data.name}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Description:</span> <span>{data.description || "N/A"}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Total Users:</span> <span>{data.total_users || "0 Users"}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Created At:</span> <span>{formatDate(data.created_at)}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Updated At:</span> <span>{formatDate(data.updated_at)}</span>
          </div>
        </div>
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
