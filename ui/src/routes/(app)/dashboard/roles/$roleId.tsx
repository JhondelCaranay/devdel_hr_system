import { fetchAccessPaginated } from "@/components/access/api";
import { RoleAccessColumns } from "@/components/access/api/columns";
import { DataTable } from "@/components/custom-ui/data-table";
import FetchErrorMessage from "@/components/custom-ui/fetch-error-message";
import { fetchRoleById } from "@/components/roles/api";
import { RoleDetails, RoleDetailSkeleton } from "@/components/roles/ui/role-detail";
import { Button } from "@/components/ui/button";
import { requirePermission } from "@/lib/auth-guards";
import type { Access, Pagination, Role } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import z from "zod";

const PageSearchSchema = z.object({
  access_page: z.number().default(1),
  access_search: z.string().default(""),
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

type AccessPaginated = {
  data: Access[];
  pagination: Pagination;
};

function RouteComponent() {
  const [rowSelection, setRowSelection] = useState({});
  const { roleId } = Route.useParams();
  const { access_page, access_search } = Route.useSearch();
  const navigate = Route.useNavigate();

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
  } = useQuery<AccessPaginated>({
    queryKey: ["access", access_page, access_search],
    queryFn: () => fetchAccessPaginated(access_page, access_search),
    enabled: !!roleId,
  });

  const handleFilterChange = (key: string, value: string | number) => {
    navigate({
      search: (old) => ({
        ...old,
        [key]: value,
        ...(key !== "access_page" ? { access_page: 1 } : {}),
      }),
      replace: true,
    });
    if (key !== "access_page") {
      setRowSelection({});
    }
  };

  const handleRoleAccessDelete = (ids: number[]) => {
    console.log("Deleting IDs:", ids);
  };

  const isError = roleDataIsError || accessDataIsError;

  if (isError) {
    return <FetchErrorMessage />;
  }

  return (
    <div className="w-full py-10">
      {/* Detail section */}
      {roleDataIsLoading && <RoleDetailSkeleton />}
      {roleData && <RoleDetails data={roleData.data} />}
      {/* Role access section */}
      <DataTable
        title="Role Access"
        isLoading={accessDataIsLoading}
        columns={RoleAccessColumns}
        data={accessData?.data ?? []}
        pageCount={accessData?.pagination?.totalPages ?? 1}
        currentPage={access_page}
        handleFilterChange={handleFilterChange}
        search={access_search}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        pageKey="access_page"
        searchKey="access_search"
        headerComponent={
          <>
            <Button variant={"outline"} className="text-sm font-medium">
              Copy Existing Access
            </Button>
            <Button variant="outline" className="text-sm font-medium">
              Add Access
            </Button>
          </>
        }
        tableComponent={
          <>
            {Boolean(Object.keys(rowSelection || {}).length) && (
              <>
                <div className="text-muted-foreground flex-1 text-sm">
                  {Object.keys(rowSelection || {}).length} of {accessData?.pagination.total} row(s)
                </div>
                <Button
                  variant="destructive"
                  onClick={() => {
                    const selectedIds = Object.keys(rowSelection || {}).map((id) => Number(id));
                    handleRoleAccessDelete(selectedIds);
                  }}
                  disabled={false}
                >
                  Delete
                </Button>
              </>
            )}
          </>
        }
      />
    </div>
  );
}
