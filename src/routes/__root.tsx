import React, { Suspense } from "react";
import { createRootRoute, Outlet } from "@tanstack/react-router";

import { MainNav } from "@/components/main-nav";
import GlobalActorProvider from "@/globalState/GlobalActorProvider";
import { Subscribe } from "@react-rxjs/core";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null // Render nothing in production
    : React.lazy(() =>
        // Lazy load in development
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
          // For Embedded Mode
          // default: res.TanStackRouterDevtoolsPanel
        }))
      );

export const Route = createRootRoute({
  component: () => (
    <GlobalActorProvider>
      <div className="flex flex-col h-full overflow-hidden">
        <MainNav className="mx-6" />

        <Subscribe fallback={null}>
          <Outlet />
        </Subscribe>
      </div>
      <Suspense fallback={null}>
        <TanStackRouterDevtools />
      </Suspense>
    </GlobalActorProvider>
  ),
});
