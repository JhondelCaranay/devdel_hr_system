import { SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/features/ui/sidebar";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/features/ui/dropdown-menu";
import { ChevronUp, User2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";

const AppSidebarFooter = () => {
  const { user } = useAuth();
  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton>
                <User2 /> {user?.username}
                <ChevronUp className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="end" className="w-[--radix-popper-anchor-width]">
              <DropdownMenuItem className="">
                <span>Account</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};
export default AppSidebarFooter;
