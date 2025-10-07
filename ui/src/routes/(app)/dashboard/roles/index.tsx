import type { Pagination, Role } from "@/types";
import { fetchRolesPaginated } from "@/components/roles/api";
import { useCreateRoleModal } from "@/components/roles/hooks/use-role-modal-store";
import { columns } from "@/components/roles/ui/columns";
import { Button } from "@/components/ui/button";
import { requirePermission } from "@/lib/auth-guards";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import FetchErrorMessage from "@/components/custom-ui/fetch-error-message";
import useDatatable from "@/hooks/use-data-table";
import z from "zod";
import { DataTableColumnFilter, DataTableV2 } from "@/components/custom-ui/data-table-v2";
import { useDebouncedCallback } from "use-debounce";

const PageSearchSchema = z.object({
  page: z.number().default(1),
  search: z.string().default(""),
});

export const Route = createFileRoute("/(app)/dashboard/roles/")({
  validateSearch: PageSearchSchema,
  beforeLoad: ({ context, location }) => {
    requirePermission(context.auth, "roles:view_roles_list_page", location.href);
  },
  component: RouteComponent,
  head: () => {
    return {
      meta: [
        {
          title: "HR System / Roles",
        },
      ],
    };
  },
});

type RolesPaginated = {
  data: Role[];
  pagination: Pagination;
};

function RouteComponent() {
  const {
    auth: { hasPermission },
  } = Route.useRouteContext();
  const [, setRowSelection] = useState({});
  const { page, search } = Route.useSearch();
  const navigate = Route.useNavigate();

  const createRoleModal = useCreateRoleModal();

  const { data: rolesData, ...roleQuery } = useQuery<RolesPaginated>({
    queryKey: ["roles", page, search],
    queryFn: () => fetchRolesPaginated(page, search),
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

  const canCreateRole = hasPermission("roles:create_roles");

  const debounced = useDebouncedCallback((value) => {
    onChangeFilter("search", value);
  }, 500);

  const isError = roleQuery.isError;
  const isLoading = roleQuery.isLoading;

  const { table } = useDatatable({
    data: rolesData?.data ?? [],
    columns: columns,
    pageCount: rolesData?.pagination?.totalPages ?? 1,
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
            <CardTitle className="text-xl font-semibold">Roles</CardTitle>
            <div className="flex space-x-2">
              <Button
                variant="default"
                className="text-sm font-medium"
                onClick={() => createRoleModal.onOpenChange(true)}
                disabled={!canCreateRole}
              >
                Add Role
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* TABLE FILTERS */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between py-4 gap-4">
            <Input
              id="search"
              defaultValue={search}
              placeholder="Search something..."
              onChange={(e) => debounced(e.target.value)}
              className="w-full lg:max-w-sm bg-white"
            />

            <div className="flex gap-4 items-center">
              <DataTableColumnFilter table={table} />
            </div>
          </div>
          {/* DATA TABLE */}
          <DataTableV2
            table={table}
            columns={columns}
            currentPage={page}
            isLoading={isLoading}
            pageCount={rolesData?.pagination?.totalPages ?? 1}
            onChangeFilter={onChangeFilter}
          />
        </CardContent>
      </Card>
    </div>
  );
}
