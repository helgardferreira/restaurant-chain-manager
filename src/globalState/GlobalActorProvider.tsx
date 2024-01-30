import { PropsWithChildren } from "react";
import { Observer, Subscription } from "xstate";
import { useActorRef } from "@xstate/react";

import { GlobalActorContext } from "./globalActorContext";
import { restaurantMachine } from "@/lib/actors/restaurant.machine";
import { branchMachine } from "@/lib/actors/branch.machine";

declare module "xstate" {
  interface InteropObservable<T> {
    [Symbol.observable]: () => InteropSubscribable<T>;
  }

  interface InteropSubscribable<T> {
    subscribe(observer: Observer<T>): Subscription;
  }
}

export default function GlobalActorProvider(props: PropsWithChildren) {
  const branchActor = useActorRef(branchMachine);
  const restaurantActor = useActorRef(restaurantMachine);

  return (
    <GlobalActorContext.Provider value={{ branchActor, restaurantActor }}>
      {props.children}
    </GlobalActorContext.Provider>
  );
}
