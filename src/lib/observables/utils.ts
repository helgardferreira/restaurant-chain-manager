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
} from "xstate";
import { KitchenLogic, RestaurantActor } from "../actors/restaurant.machine";
import { BranchActor } from "../actors/branch.machine";

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
  TMachine extends AnyStateMachine = AnyStateMachine,
>(restaurantActor: Actor<TMachine>, childId: string) {
  return fromActor(restaurantActor).pipe(
    startWith(restaurantActor.getSnapshot()),
    map((snapshot) => snapshot as SnapshotFrom<TMachine>),
    map(({ children }) => children[childId] as Actor<TChildMachine>),
    distinctUntilChanged(),
    switchMap((child) =>
      fromActor(child).pipe(
        startWith(child.getSnapshot()),
        map((snapshot) => snapshot as SnapshotFrom<TChildMachine>)
      )
    )
  );
}

export function fromCurrentRestaurantActor(branchActor: BranchActor) {
  return fromActor(branchActor).pipe(
    startWith(branchActor.getSnapshot()),
    map(({ context }) => context.currentRestaurantActor),
    filter((restaurantActor) => !!restaurantActor),
    map((restaurantActor) => restaurantActor as RestaurantActor),
    distinctUntilChanged()
  );
}

export function fromKitchenActor(restaurantActor: RestaurantActor) {
  return fromChildActor<KitchenLogic>(restaurantActor, "kitchen");
}

// TODO: make more generic
export function toActorState<T>(
  selector: (emitted: SnapshotFrom<RestaurantActor>) => T
) {
  return (source: Observable<RestaurantActor>) =>
    source.pipe(
      switchMap((restaurantActor) =>
        fromActor(restaurantActor).pipe(
          startWith(restaurantActor.getSnapshot())
        )
      ),
      map(selector),
      distinctUntilChanged()
    );
}
