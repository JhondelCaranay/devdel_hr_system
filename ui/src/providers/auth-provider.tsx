import Loader from "@/components/custom-ui/loader";
import { AuthContext } from "@/context/auth-context";
import apiClient from "@/lib/axios";
import React, { useEffect, useState } from "react";

interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: string;
  permissions: string[];
}

/* 
  Explanation of each regex:
    /^\/$/
    ^ → start of string
    \/ → a literal slash /
    $ → end of string
    ✅ Matches exactly / (the homepage).
    /^\/dashboard(\/.*)?$/
    ^\/dashboard → must start with /dashboard
    (\/.*)? → optional group:
    \/ → slash
    .* → any characters after it
    ? → means this whole group is optional
    $ → end of string
    ✅ Matches /dashboard, /dashboard/users, /dashboard/users/123, etc.
    /^\/profile(\/.*)?$/
    ✅ Matches /profile, /profile/edit, /profile/settings, etc.
    /^\/settings(\/.*)?$/
    ✅ Matches /settings, /settings/security, /settings/preferences, etc.
*/
const authRoutePatterns = [
  // /^\/$/, // matches "/"
  /^\/register(\/.*)?$/,
  /^\/dashboard(\/.*)?$/, // matches "/dashboard" and anything starting with "/dashboard/"
  /^\/profile(\/.*)?$/, // matches "/profile" and nested routes like "/profile/edit"
  /^\/settings(\/.*)?$/, // matches "/settings" and nested routes like "/settings/security"
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    typeof window !== "undefined" && localStorage.getItem("jwt") ? true : false
  );

  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const hasRole = (role: string) => user?.role.includes(role) ?? false;
  const hasAnyRole = (roles: string[]) => roles.some((r) => user?.role.includes(r)) ?? false;
  const hasAllRoles = (roles: string[]) => roles.every((r) => user?.role.includes(r)) ?? false;
  const hasPermission = (permission: string) => user?.permissions.includes(permission) ?? false;
  const hasAnyPermission = (permissions: string[]) => permissions.some((p) => user?.permissions.includes(p)) ?? false;
  const hasAllPermissions = (permissions: string[]) => permissions.every((p) => user?.permissions.includes(p)) ?? false;

  const login = async (data: AuthUser, token: string) => {
    setUser(data);
    setToken(token);
    setIsAuthenticated(true);
    localStorage.setItem("jwt", JSON.stringify(token));
  };

  const logout = async () => {
    await apiClient.post("/auth/logout");
    localStorage.removeItem("jwt");
    setUser(null);
    setIsAuthenticated(false);
    setToken(null);
    window.location.href = "/login";
  };

  useEffect(() => {
    const refreshAuth = async () => {
      const pathname = window.location.pathname;

      if (!token && authRoutePatterns.some((pattern) => pattern.test(pathname))) {
        const { data } = await apiClient.post("/auth/refresh-token");

        if (data) {
          const authUser: AuthUser = {
            id: data.id,
            username: data.username,
            email: data.email,
            role: data.role,
            permissions: data.permissions,
          };
          setToken(data.accessToken);
          setUser(authUser);
          setIsAuthenticated(true);
          localStorage.setItem("jwt", JSON.stringify(data.accessToken));
        }
      }
      setLoading(false);
    };
    refreshAuth();
  }, [token]);

  // useEffect(() => {
  //   if (token) {
  //     apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  //   } else {
  //     delete apiClient.defaults.headers.common["Authorization"];
  //   }
  // }, [token]);

  if (loading) {
    return <Loader loading={loading} fullScreen />; // or a spinner
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        user,
        hasRole,
        hasAnyRole,
        hasAllRoles,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
