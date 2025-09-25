import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col p-4 gap-4">
      <h2>Dashboard Home</h2>
      <p>Welcome to the dashboard! Select a section from the menu.</p>
    </div>
  );
}
