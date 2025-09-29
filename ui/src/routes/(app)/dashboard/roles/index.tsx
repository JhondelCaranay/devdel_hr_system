import { DataTable } from "@/components/custom-ui/data-table";
import { fetchRolesPaginated } from "@/components/roles/api";
import { columns } from "@/components/roles/ui/columns";
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
  const [, setOpenFilter] = useState(false);
  const { page, search } = Route.useSearch();
  const navigate = Route.useNavigate();

  const {
    data: roleData,
    isLoading: roleDataIsLoading,
    isError: roleDataIsError,
  } = useQuery<RolesPaginated>({
    queryKey: ["roles-paginated", page, search],
    queryFn: () => fetchRolesPaginated(page, search),
  });

  const handleFilterChange = (key: string, value: string | number) => {
    navigate({
      search: (old) => ({
        ...old,
        [key]: value,
      }),
    });
  };

  const isError = roleDataIsError;
  const isLoading = roleDataIsLoading;

  if (isError) {
    return <div className="p-4">Error loading data. Please try again later.</div>;
  }

  return (
    <div className="w-full py-10">
      <DataTable
        isLoading={isLoading}
        columns={columns}
        data={roleData?.data ?? []}
        pageCount={roleData?.pagination?.totalPages ?? 1}
        currentPage={page}
        openFilter={setOpenFilter}
        handleFilterChange={handleFilterChange}
        search={search}
      />
    </div>
  );
}
