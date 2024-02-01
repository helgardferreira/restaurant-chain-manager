import { state, useStateObservable } from "@react-rxjs/core";
import { AnyActor, SnapshotFrom } from "xstate";
import { fromActorState as _fromActorState } from "../observables/utils";
import { useRef } from "react";

// It's import to invoke `state` here to prevent memoisation issues in `useActorState`
const fromActorState = state(_fromActorState);

// Might not be necessary since we can just use `useSelector` if we're using `bind` as well as
// <Subscribe> to guarantee the value from `fromChildActor` and `toChildActor`
export function useActorState<TActor extends AnyActor, T>(
  actor: TActor,
  selector: (snapshot: SnapshotFrom<TActor>) => T
) {
  const selectorRef = useRef(selector);
  return useStateObservable(fromActorState(actor, selectorRef.current));
}
