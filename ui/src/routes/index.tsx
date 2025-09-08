import { Button } from "@/components/ui/button";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      console.log(context.auth);
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: Index,
});

function Index() {
  const { auth } = Route.useRouteContext();

  return (
    <div className="p-2">
      <pre>
        <code>{JSON.stringify({ isAuthenticated: auth.isAuthenticated, user: auth.user }, null, 2)}</code>
      </pre>
      <h3>Welcome Home!</h3>
      <Button
        onClick={() => {
          auth.logout();
        }}
      >
        Logout
      </Button>
    </div>
  );
}
