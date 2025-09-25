import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/custom-ui/app-sidebar";
import { useSidebarState } from "@/hooks/use-sidebar-state";
import { requireAuth } from "@/lib/auth-guards";

export const Route = createFileRoute("/(app)/dashboard")({
  loader: ({ context, location }) => {
    requireAuth(context.auth, location.href);
  },
  component: RouteComponent,
  notFoundComponent: () => {
    return <p>This setting page doesn't exist!</p>;
  },
});

function RouteComponent() {
  const { isOpen, handleChange } = useSidebarState();

  return (
    <div>
      <SidebarProvider defaultOpen={isOpen} onOpenChange={handleChange} open={isOpen}>
        <AppSidebar />
        <main className="w-full min-h-screen flex flex-col bg-white">
          <div className="w-full p-2 lg:px-8 sticky top-0 flex justify-between items-center border-b bg-background">
            <SidebarTrigger className="cursor-pointer" />
          </div>
          <div className="p-2 lg:p-8 overflow-auto">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}
