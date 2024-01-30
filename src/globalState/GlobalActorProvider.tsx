import { PropsWithChildren } from "react";
import { Observer, Subscription } from "xstate";
import { useActorRef } from "@xstate/react";

import { branchMachine } from "@/lib/actors/branch.machine";

import { GlobalActorContext } from "./globalActorContext";

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
  // const { branch } = IndexRoute.useSearch();
  // const restaurantActor = useActorRef(restaurantMachine, {
  //   input: {
  //     branch: branch ?? "branch=the-magic-city-grill",
  //   },
  // });

  return (
    <GlobalActorContext.Provider value={{ branchActor }}>
      {props.children}
    </GlobalActorContext.Provider>
  );
}
