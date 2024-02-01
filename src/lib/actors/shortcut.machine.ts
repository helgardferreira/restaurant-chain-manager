import {
  fromEventObservable,
  setup,
  assign,
  Actor,
  ActorLogicFrom,
} from "xstate";
import { fromEvent, map, merge } from "rxjs";
import { bind } from "@react-rxjs/core";

import { useGlobalActors } from "@/globalState";
import {
  BranchDirectorActor,
  BranchDirectorLogic,
} from "./branchDirector.machine";
import { fromChildActor, scanShortcut } from "../observables/utils";

type ShortcutModifier = "Shift" | "Control" | "Meta" | "Alt";

type ShortcutMachineContext = {
  sequence: string;
  modifiers: ShortcutModifier[];
};

type ShortcutSequenceEvent = {
  type: "SHORTCUT_SEQUENCE";
  sequence: string;
  modifiers: ShortcutModifier[];
};
type ShortcutMachineEvent = ShortcutSequenceEvent;

const shortcutMachine = setup({
  types: {} as {
    context: ShortcutMachineContext;
    events: ShortcutMachineEvent;
  },
  actions: {
    updateSequence: assign(
      (_, params: { sequence: string; modifiers: ShortcutModifier[] }) => ({
        sequence: params.sequence,
        modifiers: params.modifiers,
      })
    ),
  },
  actors: {
    listenToKeys: fromEventObservable(() => {
      // const osString = getOperatingSystem();
      // const undoString =
      //   osString === "Mac OS" ? "KeyZ,MetaLeft" : "ControlLeft,KeyZ";

      return merge(
        fromEvent<KeyboardEvent>(window, "keydown").pipe(
          map(
            (event) =>
              ({
                code: event.code,
                type: "down",
                event,
              }) as const
          )
        ),
        fromEvent<KeyboardEvent>(window, "keyup").pipe(
          map(
            (event) =>
              ({
                code: event.code,
                type: "up",
                event,
              }) as const
          )
        )
      ).pipe(
        scanShortcut(),
        // distinctUntilChanged(
        //   (sequenceA, sequenceB) => sequenceA.sequence === sequenceB.sequence
        // ),
        map(({ sequence }) => {
          const isShift = /ShiftLeft|ShiftRight/gi.test(sequence);
          const isControl = /ControlLeft|ControlRight/gi.test(sequence);
          const isMeta = /MetaLeft|MetaRight/gi.test(sequence);
          const isAlt = /AltLeft|AltRight/gi.test(sequence);

          const modifiers = [
            isShift && "Shift",
            isControl && "Control",
            isMeta && "Meta",
            isAlt && "Alt",
          ].filter(Boolean) as ShortcutModifier[];

          // If intercepting undo, prevent default. Might need more hacks.
          // if (sequence === undoString) {
          //   event.preventDefault();
          // }

          return { type: "SHORTCUT_SEQUENCE", sequence, modifiers };
        })
      );
    }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5SwBYHsBOAXAxgVywDoBDHLASwDcwBiAZQAkB5AJQBUBhAVTYH06AogEUuAgHIcBAbQAMAXUSgADmljkKaAHaKQAD0QAWAEwAaEAE9EARgCsBwgYCczxwYAcVgGwyZngL4BZppoEHA6qJi4BDoqahraSHqIALSeZpYIqYEgEdj4RKQU1DGq6uRaOvoIVjIA7IRubp61VgYAzDK2nq3piEY2NoSONm1WVo4e3r4BAUA */
  id: "shortcut",

  context: {
    sequence: "",
    modifiers: [],
  },
  initial: "active",

  states: {
    active: {
      on: {
        SHORTCUT_SEQUENCE: {
          target: "active",
          actions: {
            type: "updateSequence",
            params: ({ event }) => ({
              sequence: event.sequence,
              modifiers: event.modifiers,
            }),
          },
        },
      },
    },
  },

  invoke: {
    src: "listenToKeys",
  },
});

const [useShortcutFromBranch, fromShortcutActor] = bind(
  (branchDirectorActor: BranchDirectorActor) =>
    fromChildActor<ShortcutLogic, BranchDirectorLogic>(
      branchDirectorActor,
      "shortcut"
    )
);

function useShortcutActor() {
  const { branchDirectorActor } = useGlobalActors();
  return useShortcutFromBranch(branchDirectorActor);
}

type ShortcutActor = Actor<typeof shortcutMachine>;
type ShortcutLogic = ActorLogicFrom<typeof shortcutMachine>;

export type { ShortcutActor, ShortcutLogic };

export { shortcutMachine, fromShortcutActor, useShortcutActor };
