import {
  Actor,
  ActorLogicFrom,
  ActorRefFrom,
  assign,
  fromEventObservable,
  setup,
} from "xstate";
import { distinctUntilChanged, map } from "rxjs";

import {
  RestaurantBranch,
  restaurantBranches,
} from "@/data/restaurantBranches";

import { fromIndexSearch } from "../observables/router";
import { restaurantMachine } from "./restaurant.machine";

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
    spawnNewRestaurant: assign(
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
  /** @xstate-layout N4IgpgJg5mDOIC5QCMBOBDAdgYwBYGIAhAJQEEA5AYQAkB9AVWIBlaaKBxAUQG0AGAXUSgADgHtYASwAuE0ZiEgAHogAsAJgA0IAJ6I1agBwA6AMwA2AJwB2CwEYzDxw4C+zrWix4j6bDIBuYERkVHSMLGzkXHyCSCBikjJyCsoIala2RmoArLy8tlnZBlYGFrxmWroItoZGWa5uIJiiEHAKHji4CvHSsvKxKQC05TqIQ67uGB3evhIBXeI9Sf16VlZGBvbq+bxFJWUVellmRqVm2eMg7V4SEAA2YPMJvcmItrYq61Y5vFZnFiYWFRZEwHKqWdaWGz2JyOerOIA */
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
              type: "spawnNewRestaurant",
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
          type: "spawnNewRestaurant",
          params: ({ event: { branchId } }) => ({ branchId }),
        },
      ],
    },
  },
});

type BranchDirectorActor = Actor<typeof branchDirectorMachine>;
type BranchDirectorLogic = ActorLogicFrom<typeof branchDirectorMachine>;

export type { BranchDirectorActor, BranchDirectorLogic };

export { branchDirectorMachine };
