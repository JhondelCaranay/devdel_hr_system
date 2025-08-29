import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <header>Global Header</header>
      <Outlet /> {/* child routes go here */}
      <footer>Global Footer</footer>
    </div>
  );
}
