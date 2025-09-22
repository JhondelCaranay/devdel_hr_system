import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm, { type LoginFormValues } from "@/components/auth/ui/login-form";
import { apiClient } from "@/lib/axios";

export const Route = createFileRoute("/(auth)/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const { auth } = Route.useRouteContext();
  const navigate = useNavigate();

  async function onSubmit(values: LoginFormValues) {
    try {
      const { data } = await apiClient.post("/auth/login", {
        username: values.username,
        password: values.password,
      });

      const userData = {
        id: data.id,
        username: data.username,
        email: data.email,
        role: data.role,
        permissions: data.permissions,
      };

      await auth.login(userData, data.accessToken);

      navigate({
        to: "/dashboard",
      });
    } catch {
      alert("Login failed. Please check your credentials and try again.");
    }
  }

  return (
    <div className="h-screen lg:h-full flex justify-center items-center bg-blue-500 p-4 lg:p-8">
      <Card className="w-full h-fit max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <pre>
            <code>
              {JSON.stringify(
                {
                  authUser: auth.user,
                  isAuthenticated: auth.isAuthenticated,
                },
                null,
                2
              )}
            </code>
          </pre>
          <LoginForm
            onSubmit={onSubmit}
            defaultValues={{
              username: "",
              password: "",
            }}
          />
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a href="#" className="text-primary hover:underline">
              Sign up
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
