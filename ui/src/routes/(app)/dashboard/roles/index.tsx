import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/dashboard/roles/")({
  component: RouteComponent,
});

type RolesPaginated = {
  data: Role[];
  pagination: Pagination;
};

function RouteComponent() {
  return <div>Hello "/(app)/dashboard/roles/"!</div>;
}
