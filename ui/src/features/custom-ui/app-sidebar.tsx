import { Sidebar } from "@/features/ui/sidebar";
import AppSidebarHeader from "./app-sidebar-header";
import AppSidebarFooter from "./app-sidebar-footer";
import AppSidebarMenu from "./app-sidebar-menu";

export function AppSidebar() {
  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon" className="border-r">
      <AppSidebarHeader />
      <AppSidebarMenu />
      <AppSidebarFooter />
    </Sidebar>
  );
}
