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
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  developersLinks,
  financeLinks,
  generaLinks,
  helpLinks,
  humanResourceLinks,
  userLinks,
  type MenuLinkType,
} from "@/lib/constants/links";
import AppSidebarLinkGroup from "./app-sidebar-link-groups";
import { useAuth } from "@/context/auth-context";

const AppSidebarMenu = () => {
  const { state } = useSidebar();
  const { hasPermission, isAuthenticated } = useAuth();
  const [collapsible, setCollapsible] = useState(false);

  const isCollapse = state === "collapsed";

  useEffect(() => {
    setCollapsible(state === "collapsed");
  }, [state]);

  // ✅ Helper function to filter links based on user permission
  const filterLinksByPermission = useCallback(
    (links: MenuLinkType[]) => links.filter((link) => hasPermission(link.access)),
    [hasPermission]
  );

  // ✅ UseMemo to avoid recalculating on every render
  const filteredLinks = useMemo(
    () => ({
      general: filterLinksByPermission(generaLinks),
      hr: filterLinksByPermission(humanResourceLinks),
      finance: filterLinksByPermission(financeLinks),
      dev: filterLinksByPermission(developersLinks),
      user: filterLinksByPermission(userLinks),
      help: filterLinksByPermission(helpLinks),
    }),
    [filterLinksByPermission]
  );

  return (
    <SidebarContent>
      {isCollapse && filteredLinks.general.length > 0 && <SidebarSeparator />}
      {filteredLinks.general.length > 0 && <AppSidebarLinkGroup title="Home" links={filteredLinks.general} />}

      {isCollapse && filteredLinks.hr.length > 0 && <SidebarSeparator />}
      {filteredLinks.hr.length > 0 && <AppSidebarLinkGroup title="Human Resource" links={filteredLinks.hr} />}

      {isCollapse && filteredLinks.finance.length > 0 && <SidebarSeparator />}
      {filteredLinks.finance.length > 0 && <AppSidebarLinkGroup title="Finance" links={filteredLinks.finance} />}

      {isCollapse && filteredLinks.dev.length > 0 && <SidebarSeparator />}
      {filteredLinks.dev.length > 0 && <AppSidebarLinkGroup title="Developers" links={filteredLinks.dev} />}

      {isCollapse && filteredLinks.user.length > 0 && <SidebarSeparator />}
      {filteredLinks.user.length > 0 && <AppSidebarLinkGroup title="For me" links={filteredLinks.user} />}

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
