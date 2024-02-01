import {
  Actor,
  ActorLogicFrom,
  ActorRefFrom,
  assign,
  fromEventObservable,
  setup,
  spawnChild,
} from "xstate";
import { distinctUntilChanged, map } from "rxjs";

import {
  RestaurantBranch,
  restaurantBranches,
} from "@/data/restaurantBranches";

import { fromIndexSearch } from "../observables/router";
import { restaurantMachine } from "./restaurant.machine";
import { shortcutMachine } from "./shortcut.machine";

type BranchUrlChangeEvent = {
  type: "BRANCH_URL_CHANGE";
  branchId: string;
};

type BranchDirectorMachineContext = {
  currentBranch?: RestaurantBranch;
  currentRestaurantActor?: ActorRefFrom<typeof restaurantMachine>;
  restaurantActors: ActorRefFrom<typeof restaurantMachine>[];
};

type BranchDirectorMachineEvent = BranchUrlChangeEvent;

const branchDirectorMachine = setup({
  types: {
    context: {} as BranchDirectorMachineContext,
    events: {} as BranchDirectorMachineEvent,
  },
  actors: {
    restaurantMachine,
    shortcutMachine,
    branchUrlChange: fromEventObservable(() =>
      fromIndexSearch().pipe(
        map((search) => search.branchId ?? "the-magic-city-grill"),
        distinctUntilChanged(),
        map(
          (branchId): BranchUrlChangeEvent => ({
            type: "BRANCH_URL_CHANGE",
            branchId,
          })
        )
      )
    ),
  },
  actions: {
    setCurrentBranch: assign((_, params: { branchId: string }) => ({
      currentBranch: restaurantBranches.find(
        ({ id }) => id === params.branchId
      ),
    })),
    spawnShortcutActor: spawnChild("shortcutMachine", {
      id: "shortcut",
      systemId: "shortcut",
    }),
    spawnNewRestaurantActor: assign(
      (
        { spawn, context: { restaurantActors } },
        params: { branchId: string }
      ) => {
        const existingActor = restaurantActors.find(
          ({ id }) => id === params.branchId
        );

        if (existingActor) {
          return {
            currentRestaurantActor: existingActor,
          };
        }

        const newRestaurantMachine = spawn("restaurantMachine", {
          id: params.branchId,
          systemId: params.branchId,
          input: {
            branchId: params.branchId,
          },
        });

        return {
          currentRestaurantActor: newRestaurantMachine,
          restaurantActors: restaurantActors.concat(newRestaurantMachine),
        };
      }
    ),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QCMBOBDAdgYwBYBEBLVMbAFwHtUBiAIQCUBBAOQGEAJAfQFV6AZThxYBxAKIBtAAwBdRKAAOFWITKEKmOSAAeiACwAmADQgAnon0BmABwA6AOySLARn0BWAL7vjaLHiIlyKht0ckIANzA6JjYuXgEhZjEpWSQQRWVVdU0dBH07VxtXADY3YzMEJ1ddQs8vEEwKCDhNHxwCYlJKVE10lTUNVJyAWiKyxBHPbww2-06gkNUInqU+rMHEC10LG30igE5XZ1LTcyt9Gz3JEo861r8OwNQbQggAGzBljP7sxCcnOxsjhcrjGFSskh2QLctXcQA */
  id: "branchDirector",

  context: {
    restaurantActors: [],
  },

  initial: "idle",

  states: {
    active: {
      on: {
        BRANCH_URL_CHANGE: {
          target: "active",
          actions: [
            {
              type: "setCurrentBranch",
              params: ({ event: { branchId } }) => ({ branchId }),
            },
            {
              type: "spawnNewRestaurantActor",
              params: ({ event: { branchId } }) => ({ branchId }),
            },
          ],
        },
      },
    },

    idle: {},
  },

  invoke: {
    src: "branchUrlChange",
  },

  on: {
    BRANCH_URL_CHANGE: {
      target: ".active",

      actions: [
        {
          type: "setCurrentBranch",
          params: ({ event: { branchId } }) => ({ branchId }),
        },
        {
          type: "spawnNewRestaurantActor",
          params: ({ event: { branchId } }) => ({ branchId }),
        },
      ],
    },
  },

  entry: "spawnShortcutActor",
});

type BranchDirectorActor = Actor<typeof branchDirectorMachine>;
type BranchDirectorLogic = ActorLogicFrom<typeof branchDirectorMachine>;

export type { BranchDirectorActor, BranchDirectorLogic };

export { branchDirectorMachine };
