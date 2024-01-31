import {
  Observable,
  distinctUntilChanged,
  filter,
  from,
  map,
  scan,
  startWith,
  switchMap,
} from "rxjs";
import {
  type Actor,
  type AnyActorLogic,
  type SnapshotFrom,
  AnyStateMachine,
  ActorRefFrom,
  AnyActor,
} from "xstate";

import { RestaurantActor } from "../actors/restaurant.machine";
import { BranchDirectorActor } from "../actors/branchDirector.machine";
import { KitchenLogic } from "../actors/kitchen.machine";

export function toRunningArray<T extends object>(
  comparator: (source: T, against: T) => boolean = (previous, current) => {
    return previous === current;
  }
) {
  return (source: Observable<T>) =>
    source.pipe(
      scan((acc, value) => {
        const existingIndex = acc.findIndex((against) =>
          comparator(value, against)
        );
        if (existingIndex !== -1) {
          return acc
            .slice(0, existingIndex)
            .concat(value, acc.slice(existingIndex + 1));
        } else {
          return acc.concat(value);
        }
      }, [] as T[])
    );
}

// TODO: remove once https://github.com/statelyai/xstate/issues/4711 is fixed
export function fromActor<TLogic extends AnyActorLogic>(
  actor: Actor<TLogic> | ActorRefFrom<TLogic>
) {
  return from(actor) as Observable<SnapshotFrom<TLogic>>;
}

export function fromChildActor<
  TChildMachine extends AnyStateMachine,
  TActor extends AnyActor = AnyActor,
>(parentActor: TActor, childId: string) {
  return fromActor(parentActor).pipe(
    startWith(parentActor.getSnapshot()),
    map((snapshot) => snapshot as SnapshotFrom<TActor>),
    map(({ children }) => children[childId] as Actor<TChildMachine>),
    distinctUntilChanged()
  );
}

export function toChildActor<
  TChildMachine extends AnyStateMachine,
  TActor extends AnyActor = AnyActor,
>(childId: string) {
  return (source: Observable<TActor>) =>
    source.pipe(
      switchMap((actor) =>
        fromActor(actor).pipe(startWith(actor.getSnapshot()))
      ),
      map(({ children }) => children[childId] as Actor<TChildMachine>),
      distinctUntilChanged()
    );
}

export function fromCurrentRestaurantActor(
  branchDirectorActor: BranchDirectorActor
) {
  return fromActor(branchDirectorActor).pipe(
    startWith(branchDirectorActor.getSnapshot()),
    map(({ context }) => context.currentRestaurantActor),
    filter((restaurantActor) => !!restaurantActor),
    map((restaurantActor) => restaurantActor as RestaurantActor),
    distinctUntilChanged()
  );
}

// TODO: maybe remove
export function fromKitchenActor(restaurantActor: RestaurantActor) {
  return fromChildActor<KitchenLogic>(restaurantActor, "kitchen").pipe(
    toActorState((snapshot) => snapshot)
  );
}

// TODO: make more generic
export function toActorState<T, TActor extends AnyActor>(
  selector: (emitted: SnapshotFrom<TActor>) => T
) {
  return (source: Observable<TActor>) =>
    source.pipe(
      switchMap((actor) =>
        fromActor(actor).pipe(startWith(actor.getSnapshot()))
      ),
      map(selector),
      distinctUntilChanged()
    );
}
