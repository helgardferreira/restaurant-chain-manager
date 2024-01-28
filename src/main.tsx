import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { ThemeProvider } from "@/components/theme-provider";
import "./index.css";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import GlobalActorProvider from "./globalState/GlobalActorProvider";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ThemeProvider defaultTheme="system" storageKey="dashboard-theme">
        <GlobalActorProvider>
          <RouterProvider router={router} />
        </GlobalActorProvider>
      </ThemeProvider>
    </StrictMode>
  );
}
