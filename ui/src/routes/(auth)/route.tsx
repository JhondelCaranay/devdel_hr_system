import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center rounded-lg shadow-md overflow-hidden min-h-[calc(100vh-4rem)]">
          {/* Welcome Section */}
          <div className="hidden lg:flex flex-col justify-center space-y-6 text-center lg:text-left bg-white h-screen p-8 shadow-lg">
            <div className="space-y-4 text-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-balance">Welcome Back</h1>
              <p className="text-sm text-muted-foreground text-pretty">
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
