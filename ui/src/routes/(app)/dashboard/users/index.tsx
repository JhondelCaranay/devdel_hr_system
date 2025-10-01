import { BaseDrawer } from "@/components/custom-ui/base-drawer";
import { CompoBox } from "@/components/custom-ui/combobox";
import { DataTable } from "@/components/custom-ui/data-table";
import FetchErrorMessage from "@/components/custom-ui/fetch-error-message";
import { fetchRoleOptions } from "@/components/roles/api";
import { Button } from "@/components/ui/button";
import { fetchUsersPaginated } from "@/components/users/api";
import { columns } from "@/components/users/ui/columns";
import { requirePermission } from "@/lib/auth-guards";
import type { Pagination, User, Option } from "@/types";
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
  const [rowSelection, setRowSelection] = useState({});
  const [openFilter, setOpenFilter] = useState(false);
  const { page, search, role_uuid } = Route.useSearch();
  const navigate = Route.useNavigate();

  const {
    data: userData,
    isLoading: userDataIsLoading,
    isError: userDataIsError,
  } = useQuery<UsersPaginated>({
    queryKey: ["users-paginated", page, search, role_uuid],
    queryFn: () => fetchUsersPaginated(page, search, role_uuid),
  });

  const {
    data: roleOptionsData,
    isLoading: roleOptionsDataIsLoading,
    isError: roleOptionsDataIsError,
  } = useQuery<Option[]>({
    queryKey: ["roles-options"],
    queryFn: fetchRoleOptions,
    enabled: openFilter, // Only fetch when the filter drawer is open
  });

  const onChangeFilter = (key: string, value: string | number) => {
    navigate({
      search: (old) => ({
        ...old,
        [key]: value,
        ...(key !== "page" ? { page: 1 } : {}),
      }),
      replace: true, // Optional: replace the current history entry
    });
    if (key !== "page") {
      setRowSelection({});
    }
  };

  const onDeleteUserIds = (ids: number[]) => {
    console.log("Deleting IDs:", ids);
  };

  const isError = userDataIsError || roleOptionsDataIsError;
  const isLoading = userDataIsLoading || roleOptionsDataIsLoading;

  if (isError) {
    return <FetchErrorMessage />;
  }

  return (
    <div className="w-full py-10">
      <BaseDrawer
        open={openFilter}
        onOpenChange={setOpenFilter}
        title="Filters"
        size="md"
        side="right"
        description="Customize your list with filters."
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
                  replace: true,
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
          options={roleOptionsData ?? []}
          value={role_uuid}
          onChange={onChangeFilter}
          placeholder="Select Role..."
          searchPlaceholder="Search Role..."
        />
      </BaseDrawer>

      <DataTable
        title="Users"
        isLoading={isLoading}
        columns={columns}
        data={userData?.data ?? []}
        pageCount={userData?.pagination?.totalPages ?? 1}
        currentPage={page}
        onChangeFilter={onChangeFilter}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        search={search}
        tableComponent={
          <>
            {Boolean(Object.keys(rowSelection || {}).length) && (
              <>
                <div className="text-muted-foreground flex-1 text-sm">
                  {Object.keys(rowSelection || {}).length} of {userData?.pagination.total} row(s)
                </div>
                <Button
                  variant="destructive"
                  onClick={() => {
                    const selectedIds = Object.keys(rowSelection || {}).map((id) => Number(id));
                    onDeleteUserIds(selectedIds);
                  }}
                  disabled={false}
                >
                  Delete
                </Button>
              </>
            )}
            <Button variant="outline" onClick={() => setOpenFilter(true)}>
              Filters
            </Button>
          </>
        }
      />
    </div>
  );
}
