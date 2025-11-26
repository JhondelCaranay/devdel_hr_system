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
    <div className="h-screen lg:h-[90vh] flex justify-center items-center bg-blue-500 dark:bg-blue-800 p-4 lg:p-8 transition-colors duration-300">
      <Card className="w-full h-fit max-w-md dark:bg-card dark:text-card-foreground shadow-lg dark:shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold dark:text-foreground">Sign In</CardTitle>
          <CardDescription className="dark:text-muted-foreground">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm
            onSubmit={onSubmit}
            defaultValues={{
              username: "",
              password: "",
            }}
          />
          <div className="mt-4 text-center text-sm text-muted-foreground dark:text-muted-foreground">
            Don't have an account?{" "}
            <a href="#" className="text-primary dark:text-primary hover:underline">
              Sign up
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
