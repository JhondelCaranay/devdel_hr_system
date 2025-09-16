import { Button } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth-guards";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context, location }) => {
    requireAuth(context.auth, location.href);
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
