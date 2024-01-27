import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/settings")({
  component: () => <div></div>,
});
