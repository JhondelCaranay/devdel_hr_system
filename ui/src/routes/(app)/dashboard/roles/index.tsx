import { DataTable } from "@/components/custom-ui/data-table";
import FetchErrorMessage from "@/components/custom-ui/fetch-error-message";
import { fetchRolesPaginated } from "@/components/roles/api";
import { useCreateRoleModal } from "@/components/roles/hooks/use-role-modal-store";
import { columns } from "@/components/roles/ui/columns";
import { Button } from "@/components/ui/button";
import { requirePermission } from "@/lib/auth-guards";
import type { Pagination, Role } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import z from "zod";

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
  const [rowSelection, setRowSelection] = useState({});
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

  const isError = roleQuery.isError;
  const isLoading = roleQuery.isLoading;

  if (isError) {
    return <FetchErrorMessage />;
  }

  return (
    <div className="w-full py-10">
      <DataTable
        title="Roles"
        isLoading={isLoading}
        columns={columns}
        data={rolesData?.data ?? []}
        pageCount={rolesData?.pagination?.totalPages ?? 1}
        currentPage={page}
        onChangeFilter={onChangeFilter}
        search={search}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        headerComponent={
          <>
            <Button
              variant="default"
              className="text-sm font-medium"
              onClick={() => createRoleModal.onOpenChange(true)}
              disabled={!canCreateRole}
            >
              Add Roles
            </Button>
          </>
        }
      />
    </div>
  );
}
