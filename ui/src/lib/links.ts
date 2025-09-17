import {
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

export type MenuLinkType = {
  title: string;
  url: string;
  icon: LucideIcon;
};

export const generaLinks: MenuLinkType[] = [
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
export const humanResourceLinks: MenuLinkType[] = [
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
    title: "Cheques",
    url: "/dashboard/cheques",
    icon: Users2,
  },
];

export const financeLinks: MenuLinkType[] = [
  {
    title: "Payroll",
    url: "/dashboard/payrolls",
    icon: Users2,
  },
  {
    title: "Utility",
    url: "/dashboard/utility",
    icon: Users2,
  },
  {
    title: "Supplier",
    url: "/dashboard/Supplier",
    icon: Users2,
  },
  {
    title: "Reimbursement",
    url: "/dashboard/reimbursement",
    icon: Users2,
  },
  {
    title: "Voucher",
    url: "/dashboard/Voucher",
    icon: Users2,
  },
];

export const developersLinks: MenuLinkType[] = [
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

export const userLinks: MenuLinkType[] = [
  {
    title: "File Leave",
    url: "/dashboard/file-leaves",
    icon: Users,
  },
  {
    title: "Account",
    url: "/dashboard/account",
    icon: Lock,
  },
];

export const helpLinks: MenuLinkType[] = [
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
