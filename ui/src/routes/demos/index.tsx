import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/demos/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello demo</div>;
}
