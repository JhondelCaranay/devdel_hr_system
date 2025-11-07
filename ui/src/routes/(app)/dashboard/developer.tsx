import ExampleForm from "@/components/dummy-form";
import { Button } from "@/components/ui/button";
import { requirePermission } from "@/lib/auth-guards";
import { apiClient } from "@/lib/axios";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/(app)/dashboard/developer")({
  beforeLoad: ({ context, location }) => {
    requirePermission(context.auth, "users:view_users_list_page", location.href);
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { auth } = Route.useRouteContext();
  const [data, setData] = useState("");
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await apiClient.get("/demos");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setData("Failed to load dashboard data.");
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer); // cleanup
  }, []);

  const canCreateUser = auth.hasPermission("users:create_users");
  const canUpdateUser = auth.hasPermission("users:edit_users");
  const canDeleteUser = auth.hasPermission("users:delete_usersadw");

  const handleLogout = () => {
    auth.logout();
  };

  const handleClick = () => {
    alert("Button clicked!");
  };

  return (
    <div className="flex flex-col p-4 gap-4">
      <pre>
        <code>{JSON.stringify({ canCreateUser, canUpdateUser, canDeleteUser }, null, 2)}</code>
      </pre>
      <Button disabled={!canCreateUser} className="self-start" onClick={handleClick}>
        You can create user!
      </Button>
      <Button disabled={!canUpdateUser} className="self-start" onClick={handleClick}>
        You can update users!
      </Button>
      <Button disabled={!canDeleteUser} className="self-start" onClick={handleClick}>
        You can delete users!
      </Button>

      <Button className="self-start" onClick={handleLogout}>
        log out
      </Button>
      <div className="text-sm font-mono bg-blue-900 text-white p-2 rounded">Timer: {seconds} sec</div>
      {/* <pre className="text-xs bg-slate-900 p-2 rounded mb-4 text-white">
        <p>fetch demo</p>
        <code>{JSON.stringify({ demos: data }, null, 2)}</code>
      </pre>
      <pre className="text-xs bg-slate-900 p-2 rounded mb-4 text-white">
        <p>auth</p>
        <code>{JSON.stringify({ auth: auth }, null, 2)}</code>
      </pre> */}

      <ExampleForm />
    </div>
  );
}
