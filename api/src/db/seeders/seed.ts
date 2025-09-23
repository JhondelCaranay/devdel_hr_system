import { ENV } from "@/config/env";
import { roleAccess } from "./../schema/role_access";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "./../schema";
import { reset } from "drizzle-seed";
import { inArray } from "drizzle-orm";
import { hashPassword } from "@/utils/hashPassword";
import { createCredential } from "@/modules/auth/services/auth.services";
import { Pool } from "pg";

type dbType = NodePgDatabase<Record<string, never>> & {
  $client: Pool;
};

async function seeder() {
  const db = drizzle(ENV.DATABASE_URL);
  await reset(db, schema);

  // CREATE ROLES
  const roles = await db.insert(schema.roles).values(roleData).returning();
  console.log("Roles seeded.");
  // CREATE MODULES
  const modules = await db.insert(schema.modules).values(moduleData).returning();
  console.log("Modules seeded.");
  // CREATE ACCESS
  const homeAccess = await createAccesssByModule(db, homeAccessData, modules.find((m) => m.name === "Home")!.id);
  const hrAccess = await createAccesssByModule(db, hrAccessData, modules.find((m) => m.name === "HR")!.id);
  const financeAccess = await createAccesssByModule(
    db,
    financeAccessData,
    modules.find((m) => m.name === "Finance")!.id
  );
  const developerAccess = await createAccesssByModule(
    db,
    developersAccessData,
    modules.find((m) => m.name === "Developer")!.id
  );
  const profileAccess = await createAccesssByModule(
    db,
    profileAccessData,
    modules.find((m) => m.name === "Profile")!.id
  );
  console.log("Access seeded.");
  // CREATE ROLE ACCESS
  const adminRoleAccess = await createRoleAccessByRole(
    db,
    roles.find((r) => r.name === "admin")!.id,
    adminRoleAccessData
  );
  const ceoRoleAccess = await createRoleAccessByRole(db, roles.find((r) => r.name === "ceo")!.id, ceoRoleAccessData);
  const hrRoleAccess = await createRoleAccessByRole(db, roles.find((r) => r.name === "hr")!.id, hrRoleAccessData);
  const financeRoleAccess = await createRoleAccessByRole(
    db,
    roles.find((r) => r.name === "finance")!.id,
    financeRoleAccessData
  );
  const employeeRoleAccess = await createRoleAccessByRole(
    db,
    roles.find((r) => r.name === "employee")!.id,
    employeeRoleAccessData
  );
  console.log("Role Access seeded.");
  // CREATE USERS
  const adminUser = await createUserByRole(db, userData[0], roles.find((r) => r.name === "admin")!.id);
  const ceoUser = await createUserByRole(db, userData[1], roles.find((r) => r.name === "ceo")!.id);
  const hrUser = await createUserByRole(db, userData[2], roles.find((r) => r.name === "hr")!.id);
  const financeUser = await createUserByRole(db, userData[3], roles.find((r) => r.name === "finance")!.id);
  const employeeUser = await createUserByRole(db, userData[4], roles.find((r) => r.name === "employee")!.id);
  console.log("Users seeded.");

  console.log("Seeding completed.");

  process.exit(0);
}
seeder();

const createUserByRole = async (db: dbType, data: schema.InsertUser, role_id: number) => {
  const insertedUsers = await db
    .insert(schema.users)
    .values({ ...data, role_id })
    .returning();

  // create credential
  const hashedPassword = await hashPassword("password1234");

  await createCredential({
    userId: insertedUsers[0].id,
    username: data.email!.split("@")[0],
    password: hashedPassword,
    status: "active",
  });

  return insertedUsers[0];
};

const createAccesssByModule = async (db: dbType, data: Omit<schema.InsertAccess, "module_id">[], module_id: number) => {
  const accessData = data.map((access) => ({ ...access, module_id }));
  const insertedAccess = await db.insert(schema.access).values(accessData).returning();
  return insertedAccess;
};

const createRoleAccessByRole = async (db: dbType, role_id: number, accessCodes: string[]) => {
  const accesses = await db.select().from(schema.access).where(inArray(schema.access.code, accessCodes));
  const roleAccessData = accesses.map((access) => ({ role_id, access_id: access.id }));
  const insertedRoleAccess = await db.insert(roleAccess).values(roleAccessData).returning();
  return insertedRoleAccess;
};

const modulesData: schema.InsertModule[] = [
  { name: "Home" },
  { name: "HR" },
  { name: "Finance" },
  { name: "Developer" },
  { name: "Profile" },
];

export const homeAccessData: Omit<schema.InsertAccess, "module_id">[] = [
  // overview
  { code: "home:view_overview_page", label: "View overview page" },
  // notice board employee of the month
  { code: "notice_board:create_employee_of_the_month", label: "Create employee of the month" },
  { code: "notice_board:edit_employee_of_the_month", label: "Edit employee of the month" },
  { code: "notice_board:delete_employee_of_the_month", label: "Delete employee of the month" },
  //  notice board announcements
  { code: "notice_board:create_announcements", label: "Create announcements" },
  { code: "notice_board:edit_announcements", label: "Edit announcements" },
  { code: "notice_board:delete_announcements", label: "Delete announcements" },
  //  notice board events
  { code: "notice_board:create_events", label: "Create events" },
  { code: "notice_board:edit_events", label: "Edit events" },
  { code: "notice_board:delete_events", label: "Delete events" },
];

export const hrAccessData: Omit<schema.InsertAccess, "module_id">[] = [
  // employees
  { code: "employees:view_employees_list_page", label: "View employees page" },
  { code: "employees:view_employees_detail_page", label: "View employees page" },
  { code: "employees:create_employees", label: "Create employees" },
  { code: "employees:edit_employees", label: "Edit Employees" },
  { code: "employees:delete_employees", label: "Delete Employees" },
  {
    code: "employees:export_employees",
    label: "Export Employees (CSV, Excel, PDF, etc.)",
  },
  {
    code: "employees:import_employees",
    label: "Import Employees (CSV, Excel, PDF, etc.)",
  },
  // applicants
  { code: "applicants:view_applicants_list_page", label: "View applicants page" },
  { code: "applicants:view_applicants_detail_page", label: "View applicants page" },
  { code: "applicants:create_applicants", label: "Create applicants" },
  { code: "applicants:edit_applicants", label: "Edit Applicants" },
  { code: "applicants:delete_applicants", label: "Delete Applicants" },
  {
    code: "applicants:export_applicants",
    label: "Export Applicants (CSV, Excel, PDF, etc.)",
  },
  {
    code: "applicants:import_applicants",
    label: "Import Applicants (CSV, Excel, PDF, etc.)",
  },
  // documents
  { code: "documents:view_documents_list_page", label: "View documents page" },
  { code: "documents:view_documents_detail_page", label: "View documents page" },
  { code: "documents:create_documents", label: "Create documents" },
  { code: "documents:edit_documents", label: "Edit documents" },
  { code: "documents:delete_documents", label: "Delete documents" },
  {
    code: "documents:export_documents",
    label: "Export Documents (CSV, Excel, PDF, etc.)",
  },
  {
    code: "documents:import_documents",
    label: "Import Documents (CSV, Excel, PDF, etc.)",
  },
  // seminars
  { code: "seminars:view_seminars_list_page", label: "View seminars page" },
  { code: "seminars:view_seminars_detail_page", label: "View seminars page" },
  { code: "seminars:create_seminars", label: "Create seminars" },
  { code: "seminars:edit_seminars", label: "Edit seminars" },
  { code: "seminars:delete_seminars", label: "Delete seminars" },
  {
    code: "seminars:export_seminars",
    label: "Export Seminars (CSV, Excel, PDF, etc.)",
  },
  {
    code: "seminars:import_seminars",
    label: "Import Seminars (CSV, Excel, PDF, etc.)",
  },
  // HR leaves
  { code: "leaves:view_leaves_list_page", label: "View leaves page" },
  { code: "leaves:view_leaves_detail_page", label: "View leaves page" },
  { code: "leaves:create_leaves", label: "Create leaves" },
  { code: "leaves:edit_leaves", label: "Edit leaves" },
  { code: "leaves:delete_leaves", label: "Delete leaves" },
  {
    code: "leaves:export_leaves",
    label: "Export Leaves (CSV, Excel, PDF, etc.)",
  },
  {
    code: "leaves:import_leaves",
    label: "Import Leaves (CSV, Excel, PDF, etc.)",
  },
  // payroll
  { code: "payroll:view_payroll_list_page", label: "View payroll page" },
  { code: "payroll:view_payroll_detail_page", label: "View payroll page" },
  { code: "payroll:create_payroll", label: "Create payroll" },
  { code: "payroll:edit_payroll", label: "Edit payroll" },
  { code: "payroll:delete_payroll", label: "Delete payroll" },
  {
    code: "payroll:export_payroll",
    label: "Export Payroll (CSV, Excel, PDF, etc.)",
  },
  {
    code: "payroll:import_payroll",
    label: "Import Payroll (CSV, Excel, PDF, etc.)",
  },
];

const financeAccessData: Omit<schema.InsertAccess, "module_id">[] = [
  // utility
  { code: "utility:view_utility_list_page", label: "View utility page" },
  { code: "utility:view_utility_detail_page", label: "View utility page" },
  { code: "utility:create_utility", label: "Create utility" },
  { code: "utility:edit_utility", label: "Edit utility" },
  { code: "utility:delete_utility", label: "Delete utility" },
  {
    code: "utility:export_utility",
    label: "Export Utility (CSV, Excel, PDF, etc.)",
  },
  {
    code: "utility:import_utility",
    label: "Import Utility (CSV, Excel, PDF, etc.)",
  },
  // suppliers
  { code: "suppliers:view_suppliers_list_page", label: "View suppliers page" },
  { code: "suppliers:view_suppliers_detail_page", label: "View suppliers page" },
  { code: "suppliers:create_suppliers", label: "Create suppliers" },
  { code: "suppliers:edit_suppliers", label: "Edit suppliers" },
  { code: "suppliers:delete_suppliers", label: "Delete suppliers" },
  {
    code: "suppliers:export_suppliers",
    label: "Export Suppliers (CSV, Excel, PDF, etc.)",
  },
  {
    code: "suppliers:import_suppliers",
    label: "Import Suppliers (CSV, Excel, PDF, etc.)",
  },
  // reimbursement
  { code: "reimbursement:view_reimbursement_list_page", label: "View reimbursement page" },
  { code: "reimbursement:view_reimbursement_detail_page", label: "View reimbursement page" },
  { code: "reimbursement:create_reimbursement", label: "Create reimbursement" },
  { code: "reimbursement:edit_reimbursement", label: "Edit reimbursement" },
  { code: "reimbursement:delete_reimbursement", label: "Delete reimbursement" },
  {
    code: "reimbursement:export_reimbursement",
    label: "Export Reimbursement (CSV, Excel, PDF, etc.)",
  },
  {
    code: "reimbursement:import_reimbursement",
    label: "Import Reimbursement (CSV, Excel, PDF, etc.)",
  },
  // voucher
  { code: "voucher:view_voucher_list_page", label: "View voucher page" },
  { code: "voucher:view_voucher_detail_page", label: "View voucher page" },
  { code: "voucher:create_voucher", label: "Create voucher" },
  { code: "voucher:edit_voucher", label: "Edit voucher" },
  { code: "voucher:delete_voucher", label: "Delete voucher" },
  {
    code: "voucher:export_voucher",
    label: "Export Voucher (CSV, Excel, PDF, etc.)",
  },
  {
    code: "voucher:import_voucher",
    label: "Import Voucher (CSV, Excel, PDF, etc.)",
  },
  // cheques
  { code: "cheques:view_cheques_list_page", label: "View cheques page" },
  { code: "cheques:view_cheques_detail_page", label: "View cheques page" },
  { code: "cheques:create_cheques", label: "Create cheques" },
  { code: "cheques:edit_cheques", label: "Edit cheques" },
  { code: "cheques:delete_cheques", label: "Delete cheques" },
  {
    code: "cheques:export_cheques",
    label: "Export Cheques (CSV, Excel, PDF, etc.)",
  },
  {
    code: "cheques:import_cheques",
    label: "Import Cheques (CSV, Excel, PDF, etc.)",
  },
];

const developersAccessData: Omit<schema.InsertAccess, "module_id">[] = [
  // developer users
  { code: "users:view_users_list_page", label: "View users page" },
  { code: "users:view_users_detail_page", label: "View users page" },
  { code: "users:create_users", label: "Create users" },
  { code: "users:edit_users", label: "Edit users" },
  { code: "users:delete_users", label: "Delete users" },
  { code: "users:reset_user_credential", label: "Reset user credential" },
  { code: "users:enable_user_credential", label: "Enable user credential" },
  { code: "users:disable_user_credential", label: "Disable user credential" },
  {
    code: "users:export_users",
    label: "Export Users (CSV, Excel, PDF, etc.)",
  },
  {
    code: "users:import_users",
    label: "Import Users (CSV, Excel, PDF, etc.)",
  },
  // roles users
  { code: "roles:view_roles_list_page", label: "View roles page" },
  { code: "roles:view_roles_detail_page", label: "View roles page" },
  { code: "roles:create_roles", label: "Create roles" },
  { code: "roles:edit_roles", label: "Edit roles" },
  { code: "roles:delete_roles", label: "Delete roles" },
  { code: "roles:create_roles_access", label: "Create roles_access" },
  { code: "roles:edit_roles_access", label: "Edit roles_access" },
  { code: "roles:delete_roles_access", label: "Delete roles_access" },
  {
    code: "roles:export_roles",
    label: "Export Roles (CSV, Excel, PDF, etc.)",
  },
  {
    code: "roles:import_roles",
    label: "Import Roles (CSV, Excel, PDF, etc.)",
  },
];

const profileAccessData: Omit<schema.InsertAccess, "module_id">[] = [
  // acccount
  { code: "profile:view_profile_page", label: "View profile page" },
  { code: "profile:change_password", label: "EChange Password" },
  // File leaves
  { code: "file_leaves:view_leaves_list_page", label: "View leaves page" },
  { code: "file_leaves:view_leaves_detail_page", label: "View leaves page" },
  { code: "file_leaves:create_leaves", label: "Create leaves" },
  { code: "file_leaves:edit_leaves", label: "Edit leaves" },
  { code: "file_leaves:delete_leaves", label: "Delete leaves" },
];

const moduleData: schema.InsertModule[] = [
  { name: "Home" },
  { name: "HR" },
  { name: "Finance" },
  { name: "Developer" },
  { name: "Profile" },
];

const roleData: schema.InsertRole[] = [
  { name: "admin", description: "Administrator" },
  { name: "ceo", description: "CEO" },
  { name: "hr", description: "HR" },
  { name: "finance", description: "Finance" },
  { name: "employee", description: "Employee" },
];

const adminRoleAccessData: string[] = [
  // home
  ...homeAccessData.map((access) => access.code),
  // hr
  ...hrAccessData.map((access) => access.code),
  // finance
  ...financeAccessData.map((access) => access.code),
  // developer
  ...developersAccessData.map((access) => access.code),
  // profile
  ...profileAccessData.map((access) => access.code),
];

export const ceoRoleAccessData: string[] = [
  // home
  ...homeAccessData.map((access) => access.code),
  // hr
  ...hrAccessData.map((access) => access.code),
  // finance
  ...financeAccessData.map((access) => access.code),
  // profile
  "profile:view_profile_page",
  "profile:change_password",
  // file leaves
  "file_leaves:view_leaves_list_page",
  "file_leaves:view_leaves_detail_page",
  "file_leaves:create_leaves",
  "file_leaves:edit_leaves",
  "file_leaves:delete_leaves",
];

export const hrRoleAccessData: string[] = [
  // home
  ...homeAccessData.map((access) => access.code),
  // hr
  ...hrAccessData.map((access) => access.code),
  // profile
  "profile:view_profile_page",
  "profile:change_password",
  // file leaves
  "file_leaves:view_leaves_list_page",
  "file_leaves:view_leaves_detail_page",
  "file_leaves:create_leaves",
  "file_leaves:edit_leaves",
  "file_leaves:delete_leaves",
];

export const financeRoleAccessData: string[] = [
  // home
  "home:view_overview_page",
  // profile
  "profile:view_profile_page",
  "profile:change_password",
  // file leaves
  "file_leaves:view_leaves_list_page",
  "file_leaves:view_leaves_detail_page",
  "file_leaves:create_leaves",
  "file_leaves:edit_leaves",
  "file_leaves:delete_leaves",
  // finance access data
  ...hrAccessData.map((access) => access.code),
];

export const employeeRoleAccessData: string[] = [
  // home
  "home:view_overview_page",
  // profile
  "profile:view_profile_page",
  "profile:change_password",
  // file leaves
  "file_leaves:view_leaves_list_page",
  "file_leaves:view_leaves_detail_page",
  "file_leaves:create_leaves",
  "file_leaves:edit_leaves",
  "file_leaves:delete_leaves",
];

const userData: schema.InsertUser[] = [
  {
    first_name: "Del",
    last_name: "Caranay",
    email: "admin@gmail.com",
    role_id: 1,
  },
  {
    first_name: "Juan",
    last_name: "Dela Cruz",
    email: "juan.delacruz@example.com",
    role_id: 2,
  },
  {
    first_name: "Maria",
    last_name: "Santos",
    email: "maria.santos@example.com",
    role_id: 3,
  },
  {
    first_name: "Carlos",
    last_name: "Reyes",
    email: "carlos.reyes@example.com",
    role_id: 4,
  },
  {
    first_name: "Ana",
    last_name: "Lopez",
    email: "ana.lopez@example.com",
    role_id: 5,
  },
];
