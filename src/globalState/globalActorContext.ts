import { branchLogic } from "@/lib/actors/branch.actor";
import { restaurantMachine } from "@/lib/actors/restaurant.machine";
import { createContext, useContext } from "react";
import { ActorRefFrom } from "xstate";

interface GlobalActors {
  branchActor: ActorRefFrom<typeof branchLogic>;
  restaurantActor: ActorRefFrom<typeof restaurantMachine>;
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
