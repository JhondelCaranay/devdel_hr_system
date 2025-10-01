import { RoleAccessColumns } from "@/components/access/api/columns";
import { DataTable } from "@/components/custom-ui/data-table";
import FetchErrorMessage from "@/components/custom-ui/fetch-error-message";
import { fetchRoleAccessPaginated, fetchRoleById } from "@/components/roles/api";
import { UseCopyExistingAccessModal } from "@/components/roles/hooks/use-copy-existing-access";
import CopyExistingAccessModal from "@/components/roles/ui/copy-existing-access-modal";
import { RoleDetails, RoleDetailSkeleton } from "@/components/roles/ui/role-detail";
import { Button } from "@/components/ui/button";
import { requirePermission } from "@/lib/auth-guards";
import type { Access, Pagination, Role } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import z from "zod";

const PageSearchSchema = z.object({
  ra_page: z.number().default(1),
  ra_search: z.string().default(""),
});

export const Route = createFileRoute("/(app)/dashboard/roles/$roleId")({
  validateSearch: PageSearchSchema,
  beforeLoad: ({ context, location }) => {
    requirePermission(context.auth, "roles:view_roles_detail_page", location.href);
  },
  component: RouteComponent,
  head: () => {
    return {
      meta: [
        {
          title: "HR System / Roles / Details",
        },
      ],
    };
  },
});

type RoleDetails = {
  data: Role & { total_users: string };
};

type RoleAccessPaginated = {
  data: Access[];
  pagination: Pagination;
};

function RouteComponent() {
  const {
    auth: { hasPermission },
  } = Route.useRouteContext();
  const [rowSelection, setRowSelection] = useState({});
  const { roleId } = Route.useParams();
  const { ra_page, ra_search } = Route.useSearch();
  const navigate = Route.useNavigate();

  const { onOpenChange: onCopyAccessModalOpenChange } = UseCopyExistingAccessModal();

  const {
    data: roleData,
    isLoading: roleDataIsLoading,
    isError: roleDataIsError,
  } = useQuery<RoleDetails>({
    queryKey: ["roles", roleId],
    queryFn: () => fetchRoleById(roleId),
  });

  const {
    data: accessData,
    isLoading: accessDataIsLoading,
    isError: accessDataIsError,
  } = useQuery<RoleAccessPaginated>({
    queryKey: ["access", ra_page, ra_search],
    queryFn: () => fetchRoleAccessPaginated(ra_page, ra_search, roleId),
    enabled: !!roleId,
  });

  const onChangeFilter = (key: string, value: string | number) => {
    navigate({
      search: (old) => ({
        ...old,
        [key]: value,
        ...(key !== "ra_page" ? { ra_page: 1 } : {}),
      }),
      replace: true,
    });
    if (key !== "ra_page") {
      setRowSelection({});
    }
  };

  const onDeleteRoleAccessIds = (ids: number[]) => {
    console.log("Deleting IDs:", ids);
  };

  const canEditRole = hasPermission("roles:edit_roles");
  const hasSelectedRows = Object.keys(rowSelection || {}).length > 0;

  const isError = roleDataIsError || accessDataIsError;

  if (isError) {
    return <FetchErrorMessage />;
  }

  return (
    <div className="w-full py-10">
      {/* Detail section */}
      {roleDataIsLoading && <RoleDetailSkeleton />}
      {roleData && <RoleDetails data={roleData.data} isloading={roleDataIsLoading} />}
      {/* Role access section */}
      <DataTable
        title="Role Access"
        isLoading={accessDataIsLoading}
        columns={RoleAccessColumns}
        data={accessData?.data ?? []}
        pageCount={accessData?.pagination?.totalPages ?? 1}
        currentPage={ra_page}
        onChangeFilter={onChangeFilter}
        search={ra_search}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        pageKey="ra_page"
        searchKey="ra_search"
        headerComponent={
          <>
            <Button
              variant={"outline"}
              className="text-sm font-medium"
              onClick={() => onCopyAccessModalOpenChange(true)}
              disabled={!canEditRole}
            >
              Copy Existing Access
            </Button>
            <CopyExistingAccessModal />
            <Button variant="outline" className="text-sm font-medium" disabled={!canEditRole}>
              Add Access
            </Button>
          </>
        }
        tableComponent={
          <>
            {hasSelectedRows && (
              <div className="text-muted-foreground flex-1 text-sm">
                {Object.keys(rowSelection || {}).length} of {accessData?.pagination.total} row(s)
              </div>
            )}
            {hasSelectedRows && (
              <Button
                variant="destructive"
                onClick={() => {
                  const selectedIds = Object.keys(rowSelection || {}).map((id) => Number(id));
                  onDeleteRoleAccessIds(selectedIds);
                }}
                disabled={!canEditRole}
              >
                Delete
              </Button>
            )}
          </>
        }
      />
    </div>
  );
}
