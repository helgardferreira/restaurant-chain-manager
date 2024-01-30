import { RouterEvent, createRouter } from "@tanstack/react-router";
import { ReplaySubject } from "rxjs";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const routerSubject = new ReplaySubject<RouterEvent>();

router.subscribe("onBeforeLoad", (event) => routerSubject.next(event));
router.subscribe("onLoad", (event) => routerSubject.next(event));
router.subscribe("onResolved", (event) => routerSubject.next(event));

export { router, routerSubject };
