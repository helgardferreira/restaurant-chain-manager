import { PropsWithChildren } from "react";
import { Observer, Subscription } from "xstate";
import { useActorRef } from "@xstate/react";

import { branchDirectorMachine } from "@/lib/actors/branchDirector.machine";

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
  const branchDirectorActor = useActorRef(branchDirectorMachine, {
    systemId: "branchDirector",
  });

  return (
    <GlobalActorContext.Provider value={{ branchDirectorActor }}>
      {props.children}
    </GlobalActorContext.Provider>
  );
}
