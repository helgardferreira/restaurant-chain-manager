import { Observable, from, scan } from "rxjs";
import type { Actor, AnyActorLogic, SnapshotFrom } from "xstate";

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
export function fromActor<TLogic extends AnyActorLogic>(actor: Actor<TLogic>) {
  return from(actor) as Observable<SnapshotFrom<TLogic>>;
}
