import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { ThemeProvider } from "@/components/theme-provider";
import "./index.css";

import GlobalActorProvider from "./globalState/GlobalActorProvider";
import { router } from "./router";

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
