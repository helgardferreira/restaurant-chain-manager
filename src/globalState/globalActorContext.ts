import { createContext, useContext } from "react";
import type { Actor } from "xstate";

import { branchMachine } from "@/lib/actors/branch.machine";
import { restaurantMachine } from "@/lib/actors/restaurant.machine";

interface GlobalActors {
  branchActor: Actor<typeof branchMachine>;
  restaurantActor: Actor<typeof restaurantMachine>;
}

export const GlobalActorContext = createContext<GlobalActors | null>(null);

export const useGlobalActors = () => {
  const globalActors = useContext(GlobalActorContext);

  if (globalActors === null) {
    throw new Error(
      "useGlobalActors must be used within a GlobalActorProvider"
    );
  }

  return globalActors;
};
