import { BaseDrawer } from "@/components/custom-ui/base-drawer";
import { CompoBox } from "@/components/custom-ui/combobox";
import { DataTable } from "@/components/custom-ui/data-table";
import { Button } from "@/components/ui/button";
import { fetchUsersPaginated } from "@/components/users/api";
import { columns } from "@/components/users/ui/columns";
import { requirePermission } from "@/lib/auth-guards";
import type { Pagination, User } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import z from "zod";

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
    requirePermission(context.auth, "users:view_users_list_page", location.href);
  },
  component: RouteComponent,
  head: () => {
    return {
      meta: [
        {
          title: "HR System / Users",
        },
      ],
    };
  },
});

function RouteComponent() {
  const [openFilter, setOpenFilter] = useState(false);
  const { page, search, role_uuid } = Route.useSearch();
  const navigate = Route.useNavigate();

  const { data, isLoading, isError } = useQuery<UsersPaginated>({
    queryKey: ["users-paginated", page, search, role_uuid],
    queryFn: () => fetchUsersPaginated(page, search, role_uuid),
  });

  const handleFilterChange = (key: string, value: string | number) => {
    navigate({
      search: (old) => ({
        ...old,
        [key]: value,
      }),
      replace: true, // Optional: replace the current history entry
    });
  };

  const rolesOption = [
    { value: "ac44fbf2-6dd7-496a-9532-86d153f10952", label: "admin" },
    { value: "ae0b6ebc-1bbd-4d3b-86e3-a2e86f1c5736", label: "ceo" },
    { value: "7905f882-d31c-425e-8d64-3faee7cebe57", label: "hr" },
    { value: "35aa6e4c-1736-4d11-b127-d16a0867280b", label: "finance" },
    { value: "4efc7603-a034-4ef1-88c7-c395f0772676", label: "employee" },
  ];

  return (
    <div className="w-full py-10">
      {isLoading && <div>Loading...</div>}
      {isError && <div>Something went wrong</div>}
      <BaseDrawer
        open={openFilter}
        onOpenChange={setOpenFilter}
        title="Filters"
        size="md"
        side="right"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() =>
                navigate({
                  search: (old) => ({
                    ...old,
                    role_uuid: "",
                  }),
                  replace: true, // Optional: replace the current history entry
                })
              }
            >
              Clear
            </Button>
            <Button onClick={() => setOpenFilter(false)}>Close</Button>
          </>
        }
      >
        <p className="mb-2 font-medium text-sm">Roles</p>
        <CompoBox
          filterKey="role_uuid"
          className="w-full"
          options={rolesOption}
          value={role_uuid}
          onChange={handleFilterChange}
          placeholder="Select Role..."
          searchPlaceholder="Search Role..."
        />
      </BaseDrawer>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        pageCount={data?.pagination?.totalPages ?? 1}
        currentPage={page}
        openFilter={setOpenFilter}
        handleFilterChange={handleFilterChange}
      />
    </div>
  );
}
