import {
  ChevronDown,
  Folders,
  LayoutDashboard,
  LifeBuoy,
  Lock,
  Presentation,
  Send,
  Users,
  Users2,
  type LucideIcon,
} from "lucide-react";

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
import { useEffect, useState } from "react";

type MenuLinkType = {
  title: string;
  url: string;
  icon: LucideIcon;
};

const generaLinks: MenuLinkType[] = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Notice Board",
    url: "/dashboard/notice-board",
    icon: Presentation,
  },
];

// Menu items.
const humanResourceLinks: MenuLinkType[] = [
  {
    title: "Employees",
    url: "/dashboard/employees",
    icon: Users2,
  },
  {
    title: "Applicants",
    url: "/dashboard/applicants",
    icon: Users2,
  },
  {
    title: "Documents",
    url: "/dashboard/documents",
    icon: Folders,
  },
  {
    title: "Seminars",
    url: "/dashboard/seminars",
    icon: Users2,
  },
  {
    title: "Leaves",
    url: "/dashboard/leaves",
    icon: Users2,
  },
  {
    title: "Payroll",
    url: "/dashboard/payrolls",
    icon: Users2,
  },
];

const developersLinks: MenuLinkType[] = [
  {
    title: "Users",
    url: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Roles",
    url: "/dashboard/roles",
    icon: Lock,
  },
];

const helpLinks: MenuLinkType[] = [
  {
    title: "Supports",
    url: "/dashboard/supports",
    icon: LifeBuoy,
  },
  {
    title: "Feedbacks",
    url: "/dashboard/feedbacks",
    icon: Send,
  },
];

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

      <SidebarGroup>
        <SidebarGroupLabel>General</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {generaLinks.map((item) => (
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
      </SidebarGroup>

      {isCollapse && <SidebarSeparator />}

      <SidebarGroup>
        <SidebarGroupLabel>Human Resource </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {humanResourceLinks.map((item) => (
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
      </SidebarGroup>

      {isCollapse && <SidebarSeparator />}

      <SidebarGroup>
        <SidebarGroupLabel>Developers</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {developersLinks.map((item) => (
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
      </SidebarGroup>

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
