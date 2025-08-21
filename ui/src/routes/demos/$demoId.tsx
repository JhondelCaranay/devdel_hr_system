import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/demos/$demoId")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/demos/$demoId"!</div>;
}
