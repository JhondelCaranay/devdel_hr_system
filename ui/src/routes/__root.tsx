import type { AuthState } from "@/context/auth-context";
import ModalProvider from "@/providers/modal-provider";
import { createRootRouteWithContext, HeadContent, Outlet } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

interface MyRouterContext {
  auth: AuthState;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        name: "description",
        content: "Custom HR system built with React, Node.js, and PostgreSQL",
      },
      {
        title: "HR System",
      },
    ],
  }),
  component: () => (
    <div className="min-h-screen relative">
      <HeadContent />
      <div className="absolute inset-0 -z-10 h-full w-full bg-blue-50/50 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#c5d5ff,transparent)]"></div>
      </div>
      <ModalProvider />
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
    </div>
  ),
});
