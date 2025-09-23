// guards/auth-guards.ts
import type { AuthState } from "@/context/auth-context";
import { redirect } from "@tanstack/react-router";

export function notAuthenticated(auth: AuthState) {
  console.log("notAuthenticated - is auth", auth.isAuthenticated, window.location.pathname);
  if (auth.isAuthenticated) {
    throw redirect({
      to: "/dashboard",
    });
  }
}

export function requireAuth(auth: AuthState, locationHref: string) {
  console.log("requireAuth - is auth", auth.isAuthenticated, window.location.pathname);
  if (!auth.isAuthenticated) {
    throw redirect({
      to: "/login",
      search: { redirect: locationHref },
    });
  }
}

export function requireRole(auth: AuthState, role: string, locationHref: string) {
  if (!auth.hasRole(role)) {
    throw redirect({
      to: "/unauthorized",
      search: { redirect: locationHref },
    });
  }
}

export function requireAnyRole(auth: AuthState, roles: string[], locationHref: string) {
  if (!auth.hasAnyRole(roles)) {
    throw redirect({
      to: "/unauthorized",
      search: { redirect: locationHref },
    });
  }
}

export function requireAllRoles(auth: AuthState, roles: string[], locationHref: string) {
  if (!auth.hasAllRoles(roles)) {
    throw redirect({
      to: "/unauthorized",
      search: { redirect: locationHref },
    });
  }
}

export function requirePermission(auth: AuthState, permission: string, locationHref: string) {
  if (!auth.hasPermission(permission)) {
    throw redirect({
      to: "/unauthorized",
      search: { redirect: locationHref },
    });
  }
}

export function requireAnyPermission(auth: AuthState, permissions: string[], locationHref: string) {
  if (!auth.hasAnyPermission(permissions)) {
    throw redirect({
      to: "/unauthorized",
      search: { redirect: locationHref },
    });
  }
}

export function requireAllPermissions(auth: AuthState, permissions: string[], locationHref: string) {
  if (!auth.hasAllPermissions(permissions)) {
    throw redirect({
      to: "/unauthorized",
      search: { redirect: locationHref },
    });
  }
}
