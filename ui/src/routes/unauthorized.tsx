import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/unauthorized")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Unauthorized Access - You do not have permission to view this page.</div>;
}
