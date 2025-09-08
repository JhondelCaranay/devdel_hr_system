// guards/auth-guards.ts
import type { AuthState } from "@/context/auth-context";
import { redirect } from "@tanstack/react-router";

export function notAuthenticated(auth: AuthState) {
  if (auth.isAuthenticated) {
    throw redirect({
      to: "/",
    });
  }
}

export function requireAuth(auth: AuthState, locationHref: string) {
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
  if (!roles.some((role) => auth.hasRole(role))) {
    throw redirect({
      to: "/unauthorized",
      search: { redirect: locationHref },
    });
  }
}

export function requireAllRoles(auth: AuthState, roles: string[], locationHref: string) {
  if (!roles.every((role) => auth.hasRole(role))) {
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
  if (!permissions.some((permission) => auth.hasPermission(permission))) {
    throw redirect({
      to: "/unauthorized",
      search: { redirect: locationHref },
    });
  }
}

export function requireAllPermissions(auth: AuthState, permissions: string[], locationHref: string) {
  if (!permissions.every((permission) => auth.hasPermission(permission))) {
    throw redirect({
      to: "/unauthorized",
      search: { redirect: locationHref },
    });
  }
}
