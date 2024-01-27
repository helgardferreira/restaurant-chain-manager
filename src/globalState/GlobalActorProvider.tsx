import { PropsWithChildren } from "react";
import { useActorRef } from "@xstate/react";

import { GlobalActorContext } from "./globalActorContext";
import { branchLogic } from "@/lib/actors/branch.actor";

export default function GlobalActorProvider(props: PropsWithChildren) {
  const branchActor = useActorRef(branchLogic);

  return (
    <GlobalActorContext.Provider value={{ branchActor }}>
      {props.children}
    </GlobalActorContext.Provider>
  );
}
