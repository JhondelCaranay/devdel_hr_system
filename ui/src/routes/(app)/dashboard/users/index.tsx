import type { Pagination, User, Option } from "@/types";
import z from "zod";
import { BaseDrawer } from "@/components/custom-ui/base-drawer";
import { CompoBox } from "@/components/custom-ui/combobox";
import { DataTableColumnFilter, DataTableDeleteSelectedRows, DataTableV2 } from "@/components/custom-ui/data-table-v2";
import { fetchRoleOptions } from "@/components/roles/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fetchUsersPaginated } from "@/components/users/api";
import { columns } from "@/components/users/ui/columns";
import { requirePermission } from "@/lib/auth-guards";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import FetchErrorMessage from "@/components/custom-ui/fetch-error-message";
import useDatatable from "@/hooks/use-data-table";
import { Permission } from "@/lib/constants/permissions";
import { PageTitle } from "@/lib/utils";

type UsersPaginated = {
  data: User[];
  pagination: Pagination;
};

const PageSearchSchema = z.object({
  page: z.number().default(1),
  search: z.string().default(""),
  role_uuid: z.string().default(""),
});

export const Route = createFileRoute("/(app)/dashboard/users/")({
  validateSearch: PageSearchSchema,
  beforeLoad: ({ context, location }) => {
    requirePermission(context.auth, Permission.USERS_VIEW_LIST_PAGE, location.href);
  },
  component: RouteComponent,
  head: () => PageTitle("HR System / Roles"),
});

function RouteComponent() {
  const [openFilter, setOpenFilter] = useState(false);
  const { page, search, role_uuid } = Route.useSearch();
  const navigate = Route.useNavigate();

  const { data: userData, ...userQuery } = useQuery<UsersPaginated>({
    queryKey: ["users-paginated", page, search, role_uuid],
    queryFn: () => fetchUsersPaginated(page, search, role_uuid),
  });

  const { data: roleOptionsData, ...roleOptionsQuery } = useQuery<Option[]>({
    queryKey: ["roles-options"],
    queryFn: fetchRoleOptions,
    enabled: openFilter,
  });

  const onChangeFilter = (key: string, value: string | number) => {
    navigate({
      search: (old) => ({
        ...old,
        [key]: value,
        ...(key !== "page" ? { page: 1 } : {}),
      }),
      replace: true,
    });
    if (key !== "page") {
      setRowSelection({});
    }
  };

  const onDeleteUserIds = (ids: number[]) => {
    console.log("Deleting IDs:", ids);
  };

  const debouncedSearch = useDebouncedCallback((value) => {
    onChangeFilter("search", value);
  }, 500);

  const isError = userQuery.isError || roleOptionsQuery.isError;
  const isLoading = userQuery.isLoading || roleOptionsQuery.isLoading;

  const { table, rowSelection, setRowSelection } = useDatatable({
    data: userData?.data ?? [],
    columns: columns,
    pageCount: userData?.pagination?.totalPages ?? 1,
  });

  if (isError) {
    return <FetchErrorMessage />;
  }

  return (
    <div className="w-full py-10">
      {/* TABLE */}
      <Card className="mt-4">
        <CardHeader>
          {/* TABLE HEADER */}
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold">Users</CardTitle>
            <div className="flex space-x-2"></div>
          </div>
        </CardHeader>
        <CardContent>
          {/* TABLE FILTERS */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between py-4 gap-4">
            <Input id="search" defaultValue={search} placeholder="Search something..." onChange={(e) => debouncedSearch(e.target.value)} className="w-full lg:max-w-sm bg-white" />

            <div className="flex gap-4 items-center">
              <DataTableDeleteSelectedRows rowSelection={rowSelection} onDeleteIds={onDeleteUserIds} totalRows={userData?.pagination.total || 0} canDelete={false} />
              <Button variant="outline" onClick={() => setOpenFilter(true)}>
                Filters
              </Button>
              <DataTableColumnFilter table={table} />
            </div>
          </div>
          {/* DATA TABLE */}
          <DataTableV2 table={table} columns={columns} currentPage={page} isLoading={isLoading} pageCount={userData?.pagination?.totalPages ?? 1} onChangeFilter={onChangeFilter} />
        </CardContent>
      </Card>

      {/* FILTER MODAL */}
      <BaseDrawer
        open={openFilter}
        onOpenChange={setOpenFilter}
        title="Filters"
        size="md"
        side="right"
        description="Customize your list with filters."
        onClear={() =>
          navigate({
            search: (old) => ({
              ...old,
              role_uuid: "",
            }),
            replace: true,
          })
        }
      >
        <p className="mb-2 font-medium text-sm">Roles</p>
        <CompoBox filterKey="role_uuid" className="w-full" options={roleOptionsData ?? []} value={role_uuid} onChange={onChangeFilter} placeholder="Select Role..." searchPlaceholder="Search Role..." />
      </BaseDrawer>
    </div>
  );
}
