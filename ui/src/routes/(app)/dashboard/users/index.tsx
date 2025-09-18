import { DataTable } from "@/components/customs/data-table";
import { fetchUsersPaginated } from "@/components/users/api";
import { columns } from "@/components/users/ui/columns";
import type { Pagination, User } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

type UsersPaginated = {
  data: User[];
  pagination: Pagination;
};

const PageSearchSchema = z.object({
  page: z.number().default(1),
  search: z.string().default(""),
});

export const Route = createFileRoute("/(app)/dashboard/users/")({
  validateSearch: PageSearchSchema,
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
  const { page, search } = Route.useSearch();
  const navigate = Route.useNavigate();

  const { data, isLoading, isError } = useQuery<UsersPaginated>({
    queryKey: ["users-paginated", page, search],
    queryFn: () => fetchUsersPaginated(page, search),
  });

  const handleSearchChange = (search: string) => {
    navigate({
      search: { search },
      replace: true, // Optional: replace the current history entry
    });
  };

  const handlePageChange = (page: number) => {
    navigate({
      search: { page },
      replace: true, // Optional: replace the current history entry
    });
  };

  return (
    <div className="w-full py-10">
      {isLoading && <div>Loading...</div>}
      {isError && <div>Something went wrong</div>}

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        pageCount={data?.pagination?.totalPages ?? 1}
        currentPage={page}
        onPageChange={handlePageChange}
        onSearch={handleSearchChange}
      />
    </div>
  );
}
