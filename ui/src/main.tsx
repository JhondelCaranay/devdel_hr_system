import { StrictMode, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import "./index.css";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { useAuth } from "./context/auth-context";
import { AuthProvider } from "./providers/auth-provider";
import { Toaster as Sonner } from "sonner";
import QueryProvider from "./providers/query-provider";
import { ThemeProvider } from "./providers/theme-provider";

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
  },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function InnerApp() {
  const auth = useAuth();

  useEffect(() => {
    router.invalidate();
  }, [auth]);

  return <RouterProvider router={router} context={{ auth }} />;
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <AuthProvider>
        <QueryProvider>
          <ThemeProvider defaultTheme="dark" storageKey="react-ui-theme">
            <Sonner />
            <InnerApp />
          </ThemeProvider>
        </QueryProvider>
      </AuthProvider>
    </StrictMode>
  );
}
