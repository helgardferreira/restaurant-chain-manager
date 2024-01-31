import { createContext, useContext } from "react";

import type { BranchDirectorActor } from "@/lib/actors/branchDirector.machine";

interface GlobalActors {
  branchDirectorActor: BranchDirectorActor;
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
