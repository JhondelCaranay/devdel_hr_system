import { ChevronDown } from "lucide-react";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/features/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { developersLinks, financeLinks, generaLinks, helpLinks, humanResourceLinks, userLinks } from "@/lib/links";
import AppSidebarLinkGroup from "./app-sidebar-link-groups";

const AppSidebarMenu = () => {
  const { state } = useSidebar();
  const [collapsible, setCollapsible] = useState(false);

  const isCollapse = state === "collapsed";

  useEffect(() => {
    setCollapsible(state === "collapsed");
  }, [state]);

  return (
    <SidebarContent>
      {isCollapse && <SidebarSeparator />}
      <AppSidebarLinkGroup title="Home" links={generaLinks} />

      {isCollapse && <SidebarSeparator />}
      <AppSidebarLinkGroup title="Human Resource" links={humanResourceLinks} />

      {isCollapse && <SidebarSeparator />}
      <AppSidebarLinkGroup title="Finance" links={financeLinks} />

      {isCollapse && <SidebarSeparator />}
      <AppSidebarLinkGroup title="Developers" links={developersLinks} />

      {isCollapse && <SidebarSeparator />}
      <AppSidebarLinkGroup title="For me" links={userLinks} />

      {isCollapse && <SidebarSeparator />}
      <Collapsible
        defaultOpen={isCollapse}
        open={collapsible}
        onOpenChange={() => setCollapsible(!collapsible)}
        disabled={isCollapse}
        className="group/collapsible"
      >
        <SidebarGroup>
          <SidebarGroupLabel asChild>
            <CollapsibleTrigger>
              Help
              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </CollapsibleTrigger>
          </SidebarGroupLabel>
          <CollapsibleContent>
            <SidebarGroupContent>
              <SidebarMenu>
                {helpLinks.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <Link to={item.url} activeOptions={{ exact: true }}>
                      {({ isActive }) => (
                        <div className="flex items-center gap-2">
                          <SidebarMenuButton isActive={isActive}>
                            <item.icon />
                            <span>{item.title}</span>
                          </SidebarMenuButton>
                        </div>
                      )}
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>
    </SidebarContent>
  );
};
export default AppSidebarMenu;
