import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/demos/__layout")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>sefsfs</div>;
}
