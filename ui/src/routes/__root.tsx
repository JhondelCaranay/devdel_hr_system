import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        name: "description",
        content: "Custom HR system built with React, Node.js, and PostgreSQL",
      },
      {
        title: "DevDel HR System",
      },
    ],
  }),
  component: () => (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <Outlet />
      </body>
      <TanStackRouterDevtools />
    </html>
  ),
});
