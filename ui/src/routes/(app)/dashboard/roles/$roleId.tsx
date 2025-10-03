import type { Access, Pagination, Role } from "@/types";
import FetchErrorMessage from "@/components/custom-ui/fetch-error-message";
import z from "zod";

import { RoleAccessColumns } from "@/components/access/api/columns";
import { DataTable } from "@/components/custom-ui/data-table";
import { fetchRoleAccessPaginated, fetchRoleById } from "@/components/roles/api";
import { useCopyExistingAccessModal } from "@/components/roles/hooks/use-role-modal-store";
import { RoleDetails } from "@/components/roles/ui/role-detail";
import { Button } from "@/components/ui/button";
import { requirePermission } from "@/lib/auth-guards";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

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

  const copyExistingAccessModal = useCopyExistingAccessModal();

  const { data: roleData, ...roleQuery } = useQuery<RoleDetails>({
    queryKey: ["roles", roleId],
    queryFn: () => fetchRoleById(roleId),
  });

  const { data: roleAccessData, ...roleAccessQuery } = useQuery<RoleAccessPaginated>({
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

  const isError = roleQuery.isError || roleAccessQuery.isError;

  if (isError) {
    return <FetchErrorMessage />;
  }

  return (
    <div className="w-full py-10">
      {/* Detail section */}
      <RoleDetails data={roleData?.data} />
      {/* Role access section */}
      <DataTable
        title="Role Access"
        isLoading={roleAccessQuery.isLoading}
        columns={RoleAccessColumns}
        data={roleAccessData?.data ?? []}
        pageCount={roleAccessData?.pagination?.totalPages ?? 1}
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
              onClick={() => copyExistingAccessModal.onOpenChange(true, roleData?.data.uuid)}
              disabled={!canEditRole}
            >
              Copy Existing Access
            </Button>
            <Button variant="outline" className="text-sm font-medium" disabled={!canEditRole}>
              Add Access
            </Button>
          </>
        }
        tableComponent={
          <>
            {hasSelectedRows && (
              <div className="text-muted-foreground flex-1 text-sm">
                {Object.keys(rowSelection || {}).length} of {roleAccessData?.pagination.total} row(s)
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
