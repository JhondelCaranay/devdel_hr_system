import { AuthContext } from "@/context/auth-context";
import React, { useState } from "react";

interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: string;
  permissions: string[];
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const storedUser = localStorage.getItem("authUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem("authUser");
  });

  const hasRole = (role: string) => user?.role.includes(role) ?? false;
  const hasAnyRole = (roles: string[]) => roles.some((r) => user?.role.includes(r)) ?? false;
  const hasAllRoles = (roles: string[]) => roles.every((r) => user?.role.includes(r)) ?? false;
  const hasPermission = (permission: string) => user?.permissions.includes(permission) ?? false;
  const hasAnyPermission = (permissions: string[]) => permissions.some((p) => user?.permissions.includes(p)) ?? false;
  const hasAllPermissions = (permissions: string[]) => permissions.every((p) => user?.permissions.includes(p)) ?? false;

  const login = async (data: AuthUser, jwt: string) => {
    setUser(data);
    setIsAuthenticated(true);
    localStorage.setItem("authUser", JSON.stringify(data));
    localStorage.setItem("jwt", JSON.stringify(jwt));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("authUser");
    localStorage.removeItem("jwt");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
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
