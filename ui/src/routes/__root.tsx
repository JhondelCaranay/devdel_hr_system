import { createRootRoute, HeadContent, Link, Outlet } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

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
        <div className="p-2 flex gap-2">
          <Link to="/" className="[&.active]:font-bold">
            Home
          </Link>{" "}
          <Link to="/dashboard" className="[&.active]:font-bold">
            dashboard
          </Link>
          <Link to="/demos" className="[&.active]:font-bold">
            Demos
          </Link>
        </div>
        <Outlet />
      </body>
      <hr />
      {/* <TanStackRouterDevtools /> */}
    </html>
  ),
});
