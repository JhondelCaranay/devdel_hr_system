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
import { Permission } from "./permissions";

export type MenuLinkType = {
  title: string;
  url: string;
  icon: LucideIcon;
  access: string;
};

export const generaLinks: MenuLinkType[] = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: LayoutDashboard,
    access: Permission.HOME_VIEW_OVERVIEW_PAGE,
  },
  {
    title: "Notice Board",
    url: "/dashboard/notice-board",
    icon: Presentation,
    access: Permission.NOTTICE_VIEW_PAGE,
  },
];

// Menu items.
export const humanResourceLinks: MenuLinkType[] = [
  {
    title: "Employees",
    url: "/dashboard/employees",
    icon: Users2,
    access: Permission.EMPLOYEES_VIEW_LIST_PAGE,
  },
  {
    title: "Applicants",
    url: "/dashboard/applicants",
    icon: Users2,
    access: Permission.APPLICANTS_VIEW_LIST_PAGE,
  },
  {
    title: "Documents",
    url: "/dashboard/documents",
    icon: Folders,
    access: Permission.DOCUMENTS_VIEW_LIST_PAGE,
  },
  {
    title: "Seminars",
    url: "/dashboard/seminars",
    icon: Users2,
    access: Permission.SEMINARS_VIEW_LIST_PAGE,
  },
  {
    title: "Leaves",
    url: "/dashboard/leaves",
    icon: Users2,
    access: Permission.LEAVES_VIEW_LIST_PAGE,
  },
];

export const financeLinks: MenuLinkType[] = [
  {
    title: "Payroll",
    url: "/dashboard/payrolls",
    icon: Users2,
    access: Permission.PAYROLL_VIEW_LIST_PAGE,
  },
  {
    title: "Reimbursement",
    url: "/dashboard/reimbursement",
    icon: Users2,
    access: Permission.REIMBURSEMENT_VIEW_LIST_PAGE,
  },
  {
    title: "Utility",
    url: "/dashboard/utility",
    icon: Users2,
    access: Permission.UTILITY_VIEW_LIST_PAGE,
  },
  {
    title: "Supplier",
    url: "/dashboard/supplier",
    icon: Users2,
    access: Permission.SUPPLIERS_VIEW_LIST_PAGE,
  },
  {
    title: "Purchasing",
    url: "/dashboard/purchasing",
    icon: Users2,
    access: Permission.PURCHASING_VIEW_LIST_PAGE,
  },
  {
    title: "Voucher",
    url: "/dashboard/voucher",
    icon: Users2,
    access: Permission.VOUCHER_VIEW_LIST_PAGE,
  },
  {
    title: "Accounts Payable",
    url: "/dashboard/accounts-payable",
    icon: Users2,
    access: Permission.ACCOUNTS_PAYABLE_VIEW_LIST_PAGE,
  },
  {
    title: "Cheques",
    url: "/dashboard/cheques",
    icon: Users2,
    access: Permission.CHEQUES_VIEW_LIST_PAGE,
  },
];

export const developersLinks: MenuLinkType[] = [
  {
    title: "Users",
    url: "/dashboard/users",
    icon: Users,
    access: Permission.USERS_VIEW_LIST_PAGE,
  },
  {
    title: "Roles",
    url: "/dashboard/roles",
    icon: Lock,
    access: Permission.ROLES_VIEW_LIST_PAGE,
  },
  {
    title: "Access",
    url: "/dashboard/access",
    icon: Lock,
    access: Permission.ROLES_VIEW_LIST_PAGE,
  },
  {
    title: "Developer",
    url: "/dashboard/developer",
    icon: Lock,
    access: Permission.ROLES_VIEW_LIST_PAGE,
  },
];

export const userLinks: MenuLinkType[] = [
  {
    title: "File Leave",
    url: "/dashboard/file-leaves",
    icon: Users,
    access: Permission.FILE_LEAVES_VIEW_LIST_PAGE,
  },
  {
    title: "Account",
    url: "/dashboard/account",
    icon: Lock,
    access: Permission.PROFILE_VIEW_PAGE,
  },
];

export const helpLinks: MenuLinkType[] = [
  {
    title: "Supports",
    url: "/dashboard/supports",
    icon: LifeBuoy,
    access: Permission.HOME_VIEW_OVERVIEW_PAGE,
  },
  {
    title: "Feedbacks",
    url: "/dashboard/feedbacks",
    icon: Send,
    access: Permission.HOME_VIEW_OVERVIEW_PAGE,
  },
];
