import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/dashboard/employees/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(app)/dashboard/employees/"!</div>;
}
