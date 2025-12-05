import type { Access, Pagination, Role } from "@/types";
import z from "zod";
import useDatatable from "@/hooks/use-data-table";
import FetchErrorMessage from "@/components/custom-ui/fetch-error-message";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { roleAccessColumns } from "@/components/access/api/columns";
import { fetchRoleAccessPaginated, fetchRoleById } from "@/components/roles/api";
import { useAddRoleAccessModal, useCopyExistingAccessModal } from "@/components/roles/hooks/use-role-modal-store";
import { RoleDetails } from "@/components/roles/ui/role-detail";
import { Button } from "@/components/ui/button";
import { requirePermission } from "@/lib/auth-guards";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { DataTableColumnFilter, DataTableDeleteSelectedRows, DataTableV2 } from "@/components/custom-ui/data-table-v2";
import { useDebouncedCallback } from "use-debounce";
import { Permission } from "@/lib/constants/permissions";

const PageSearchSchema = z.object({
  ra_page: z.number().default(1),
  ra_search: z.string().default(""),
});

export const Route = createFileRoute("/(app)/dashboard/roles/$roleId")({
  validateSearch: PageSearchSchema,
  beforeLoad: ({ context, location }) => {
    requirePermission(context.auth, Permission.ROLES_VIEW_DETAIL_PAGE, location.href);
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
  const { auth } = Route.useRouteContext();
  const { roleId } = Route.useParams();
  const { ra_page, ra_search } = Route.useSearch();
  const navigate = Route.useNavigate();

  const copyExistingAccessModal = useCopyExistingAccessModal();
  const copyAddRoleAccessModal = useAddRoleAccessModal();

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

  const isDataAdmin = roleData?.data.name === "Admin";
  const canEditRoleAccess = auth.hasPermission(Permission.ROLES_ACCESS_EDIT) && !isDataAdmin;
  const canCreateRoleAccess = auth.hasPermission(Permission.ROLES_ACCESS_CREATE) && !isDataAdmin;
  const canDeleteRoleAccess = auth.hasPermission(Permission.ROLES_ACCESS_DELETE) && !isDataAdmin;

  const debounced = useDebouncedCallback((value) => {
    onChangeFilter("search", value);
  }, 500);

  const isError = roleQuery.isError || roleAccessQuery.isError;

  const { table, rowSelection, setRowSelection } = useDatatable({
    data: roleAccessData?.data ?? [],
    columns: roleAccessColumns,
    pageCount: roleAccessData?.pagination?.totalPages ?? 1,
  });

  if (isError) {
    return <FetchErrorMessage />;
  }

  return (
    <div className="w-full py-10">
      {/* Detail section */}
      <RoleDetails data={roleData?.data} />
      {/* ROLE ACCESS TABLE */}
      <Card className="mt-4">
        <CardHeader>
          {/* TABLE HEADER */}
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold">Role Access</CardTitle>
            <div className="flex space-x-2">
              <Button
                variant={"outline"}
                className="text-sm font-medium"
                onClick={() => copyExistingAccessModal.onOpenChange(true, roleData?.data.uuid)}
                disabled={!canEditRoleAccess}
              >
                Copy Existing Access
              </Button>
              <Button
                variant="outline"
                className="text-sm font-medium"
                onClick={() => copyAddRoleAccessModal.onOpenChange(true, roleData?.data.uuid)}
                disabled={!canCreateRoleAccess}
              >
                Add Access
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* TABLE FILTERS */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between py-4 gap-4">
            <Input
              id="search"
              defaultValue={ra_search}
              placeholder="Search something..."
              onChange={debounced}
              className="w-full lg:max-w-sm bg-white"
            />

            <div className="flex gap-4 items-center">
              <DataTableDeleteSelectedRows
                rowSelection={rowSelection}
                onDeleteIds={onDeleteRoleAccessIds}
                totalRows={roleAccessData?.pagination.total || 0}
                canDelete={!canDeleteRoleAccess}
              />
              <DataTableColumnFilter table={table} />
            </div>
          </div>
          {/* DATA TABLE */}
          <DataTableV2
            table={table}
            columns={roleAccessColumns}
            currentPage={ra_page}
            isLoading={roleAccessQuery.isLoading}
            pageCount={roleAccessData?.pagination?.totalPages ?? 1}
            onChangeFilter={onChangeFilter}
            pageKey="ra_page"
          />
        </CardContent>
      </Card>
    </div>
  );
}
