import { PropsWithChildren } from "react";
import { useActorRef } from "@xstate/react";

import { GlobalActorContext } from "./globalActorContext";
import { branchLogic } from "@/lib/actors/branch.actor";
import { restaurantMachine } from "@/lib/actors/restaurant.machine";

export default function GlobalActorProvider(props: PropsWithChildren) {
  const branchActor = useActorRef(branchLogic);
  const restaurantActor = useActorRef(restaurantMachine);

  return (
    <GlobalActorContext.Provider value={{ branchActor, restaurantActor }}>
      {props.children}
    </GlobalActorContext.Provider>
  );
}
