import { AnyActorSystem } from "node_modules/xstate/dist/declarations/src/system";
import {
  Observable,
  OperatorFunction,
  animationFrames,
  defer,
  distinctUntilChanged,
  filter,
  firstValueFrom,
  from,
  map,
  mergeMap,
  of,
  retry,
  scan,
  skipWhile,
  startWith,
  switchMap,
  throwError,
} from "rxjs";
import {
  type Actor,
  type AnyActorLogic,
  type SnapshotFrom,
  AnyStateMachine,
  ActorRefFrom,
  AnyActor,
  EventFromLogic,
} from "xstate";
import { XOR } from "ts-xor";

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

export function filterNullish<T>(
  source: Observable<T | null | undefined>
): Observable<T> {
  return source.pipe(
    filter((x) => x !== null && x !== undefined) as OperatorFunction<
      T | null | undefined,
      T
    >
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
  TParentMachine extends AnyStateMachine = AnyStateMachine,
>(
  parentActor: Actor<TParentMachine>,
  childId: string
): Observable<Actor<TChildMachine>>;
export function fromChildActor<
  TChildMachine extends AnyStateMachine,
  TParentMachine extends AnyStateMachine = AnyStateMachine,
>(
  parentActor: Actor<TParentMachine>,
  childSelector: (
    snapshot: SnapshotFrom<TParentMachine>
  ) => Actor<TChildMachine> | ActorRefFrom<TChildMachine> | undefined
): Observable<Actor<TChildMachine>>;
export function fromChildActor<
  TChildMachine extends AnyStateMachine,
  TParentMachine extends AnyStateMachine = AnyStateMachine,
>(
  parentActor: Actor<TParentMachine>,
  child:
    | string
    | ((
        snapshot: SnapshotFrom<TParentMachine>
      ) => Actor<TChildMachine> | ActorRefFrom<TChildMachine> | undefined)
): Observable<Actor<TChildMachine>> {
  return fromActor(parentActor).pipe(
    startWith(parentActor.getSnapshot()),
    map((snapshot) => snapshot as SnapshotFrom<TParentMachine>),
    map(
      typeof child === "string"
        ? ({ children }) => children[child] as Actor<TChildMachine>
        : child
    ),
    filterNullish,
    distinctUntilChanged()
  );
}

export function toChildActor<
  TChildMachine extends AnyStateMachine,
  TParentMachine extends AnyStateMachine = AnyStateMachine,
>(
  childId: string
): (
  source: Observable<Actor<TParentMachine>>
) => Observable<Actor<TChildMachine>>;
export function toChildActor<
  TChildMachine extends AnyStateMachine,
  TParentMachine extends AnyStateMachine = AnyStateMachine,
>(
  childSelector: (
    snapshot: SnapshotFrom<Actor<TParentMachine>>
  ) => Actor<TChildMachine> | undefined
): (
  source: Observable<Actor<TParentMachine>>
) => Observable<Actor<TChildMachine>>;
export function toChildActor<
  TChildMachine extends AnyStateMachine,
  TParentMachine extends AnyStateMachine = AnyStateMachine,
>(
  child:
    | string
    | ((
        snapshot: SnapshotFrom<Actor<TParentMachine>>
      ) => Actor<TChildMachine> | undefined)
): (
  source: Observable<Actor<TParentMachine>>
) => Observable<Actor<TChildMachine>> {
  return (source: Observable<Actor<TParentMachine>>) =>
    source.pipe(
      switchMap((actor) =>
        fromActor<TParentMachine>(actor).pipe(
          startWith(actor.getSnapshot()),
          map((snapshot) => snapshot as SnapshotFrom<TParentMachine>)
        )
      ),
      map(
        typeof child === "string"
          ? ({ children }) => children[child] as Actor<TChildMachine>
          : child
      ),
      filterNullish,
      distinctUntilChanged()
    );
}

export function fromSystemActor<TLogic extends AnyActorLogic>(
  system: AnyActorSystem,
  systemId: string,
  retryCount?: number,
  delay?: number
): Observable<Actor<TLogic>> {
  return defer(() => of(system.get(systemId) as Actor<TLogic>)).pipe(
    mergeMap((actor) =>
      actor !== undefined
        ? of(actor)
        : throwError(
            () => new Error(`Actor with systemId: ${systemId} not found`)
          )
    ),
    retry({
      count: retryCount ?? 5,
      delay: delay ?? 100,
    })
  );
}

type SendSystemEventRetryConfig = {
  delay?: number;
  count: number;
};
type SendSystemEventTimeoutConfig = {
  delay?: number;
  timeout: number;
};

export function sendSystemEvent<TLogic extends AnyActorLogic>(
  system: AnyActorSystem,
  systemId: string,
  event: EventFromLogic<TLogic>,
  retryConfig: XOR<SendSystemEventRetryConfig, SendSystemEventTimeoutConfig> = {
    count: 5,
  }
): Promise<void> {
  const initialTimestamp = performance.now();

  return firstValueFrom(
    defer(() => of(system.get(systemId) as Actor<TLogic>)).pipe(
      mergeMap((actor) =>
        actor !== undefined
          ? of(actor.send(event))
          : throwError(
              () => new Error(`Actor with systemId: ${systemId} not found`)
            )
      ),
      retry({
        count: retryConfig.count,
        delay: (_, count) =>
          animationFrames().pipe(
            skipWhile(({ timestamp }) => {
              const totalElapsed = timestamp - initialTimestamp;

              if (totalElapsed > (retryConfig.timeout ?? Infinity))
                throw new Error(`Actor with systemId: ${systemId} not found`);

              return totalElapsed / count < (retryConfig.delay ?? 100);
            })
          ),
      })
    )
  );
}

// TODO: make more generic
export function toActorState<TActor extends AnyActor, T>(
  selector: (snapshot: SnapshotFrom<TActor>) => T
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
