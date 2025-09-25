import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { type MenuLinkType } from "@/lib/links";

export type AppSidebarLinkGroupProps = {
  title: string;
  links: MenuLinkType[];
  withBadge?: boolean;
};
const AppSidebarLinkGroup = ({ title, links, withBadge = false }: AppSidebarLinkGroupProps) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {links.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Link to={item.url} activeOptions={{ exact: true }}>
                {({ isActive }) => (
                  <div className="flex items-center gap-2">
                    <SidebarMenuButton isActive={isActive}>
                      <item.icon />
                      <span>{item.title}</span>
                      {withBadge && (
                        <SidebarMenuBadge className="p-1 rounded-full bg-yellow-300 text-slate-800">
                          24
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuButton>
                  </div>
                )}
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
export default AppSidebarLinkGroup;
