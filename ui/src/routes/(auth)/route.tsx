import { notAuthenticated } from "@/lib/auth-guards";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)")({
  beforeLoad: async ({ context }) => {
    notAuthenticated(context.auth);
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full h-screen bg-transparent  transition-colors duration-300">
      <div className="container mx-auto px-6 lg:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center rounded-lg shadow-md overflow-hidden min-h-[90vh]">
          {/* Welcome Section */}
          <div className="hidden lg:flex flex-col justify-center space-y-6 text-center lg:text-left bg-white dark:bg-card dark:text-card-foreground h-[90vh] p-8 shadow-lg transition-colors duration-300">
            <div className="space-y-4 text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground dark:text-foreground">Welcome Back</h1>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                Sign in to your account to continue your journey with us. We're glad to have you back!
              </p>
            </div>
          </div>

          {/* Login Form Section */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}
