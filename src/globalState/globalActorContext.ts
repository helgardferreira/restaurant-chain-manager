import { createContext, useContext } from "react";

import type { BranchActor } from "@/lib/actors/branch.machine";

interface GlobalActors {
  branchActor: BranchActor;
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
