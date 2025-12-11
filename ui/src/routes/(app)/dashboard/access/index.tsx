import type { Pagination, Access } from "@/types";
import { Button } from "@/components/ui/button";
import { requirePermission } from "@/lib/auth-guards";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import FetchErrorMessage from "@/components/custom-ui/fetch-error-message";
import useDatatable from "@/hooks/use-data-table";
import { DataTableColumnFilter, DataTableV2 } from "@/components/custom-ui/data-table-v2";
import { useDebouncedCallback } from "use-debounce";
import { Permission } from "@/lib/constants/permissions";
import { useCreateAccessModal } from "@/components/access/hooks/use-access-modal-store";
import { fetchAccessPaginated } from "@/components/access/api";
import { accessColumns } from "@/components/access/ui/columns";
import { PageTitle } from "@/lib/utils";
import z from "zod";

const PageSearchSchema = z.object({
  page: z.number().default(1),
  search: z.string().default(""),
});

export const Route = createFileRoute("/(app)/dashboard/access/")({
  validateSearch: PageSearchSchema,
  beforeLoad: ({ context, location }) => {
    requirePermission(context.auth, Permission.PAYROLL_VIEW_LIST_PAGE, location.href);
  },
  component: RouteComponent,
  head: () => PageTitle("HR System / Access"),
});

type AccesssPaginated = {
  data: Access[];
  pagination: Pagination;
};

function RouteComponent() {
  const { auth } = Route.useRouteContext();
  const [, setRowSelection] = useState({});
  const { page, search } = Route.useSearch();
  const navigate = Route.useNavigate();
  const createAccessModal = useCreateAccessModal();

  const { data: accesssData, ...accessQuery } = useQuery<AccesssPaginated>({
    queryKey: ["access", page, search],
    queryFn: () => fetchAccessPaginated(page, search),
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

  const debouncedSearch = useDebouncedCallback((value) => {
    onChangeFilter("search", value);
  }, 500);

  const canCreateAccess = auth.hasPermission(Permission.ACCESS_CREATE);

  const isError = accessQuery.isError;
  const isLoading = accessQuery.isLoading;

  const { table } = useDatatable({
    data: accesssData?.data ?? [],
    columns: accessColumns,
    pageCount: accesssData?.pagination?.totalPages ?? 1,
  });

  if (isError) {
    return <FetchErrorMessage />;
  }

  return (
    <div className="w-full py-10">
      <Card className="mt-4">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold">Access</CardTitle>
            <div className="flex space-x-2">
              <Button variant="default" className="text-sm font-medium" onClick={() => createAccessModal.onOpenChange(true)} disabled={!canCreateAccess}>
                Add Access
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between py-4 gap-4">
            <Input id="search" defaultValue={search} placeholder="Search something..." onChange={(e) => debouncedSearch(e.target.value)} className="w-full lg:max-w-sm bg-white" />
            <div className="flex gap-4 items-center">
              <DataTableColumnFilter table={table} />
            </div>
          </div>
          <DataTableV2 table={table} columns={accessColumns} currentPage={page} isLoading={isLoading} pageCount={accesssData?.pagination?.totalPages ?? 1} onChangeFilter={onChangeFilter} />
        </CardContent>
      </Card>
    </div>
  );
}
