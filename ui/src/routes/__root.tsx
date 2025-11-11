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
      <div
        className="absolute inset-0 -z-10 h-full w-full 
  bg-blue-50/50 
  bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] 
  bg-[size:6rem_4rem]
  dark:bg-[#0f172a] 
  dark:bg-[linear-gradient(to_right,#1e3a8a33_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a33_1px,transparent_1px)]
"
      >
        <div
          className="absolute inset-0 
    bg-[radial-gradient(circle_800px_at_100%_200px,#c5d5ff,transparent)] 
    dark:bg-[radial-gradient(circle_800px_at_100%_200px,#1e3a8a,#0f172a_50%,transparent_90%)]
    "
        ></div>
      </div>
      <ModalProvider />
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
    </div>
  ),
});
