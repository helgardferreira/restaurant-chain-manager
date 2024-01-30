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
  branch: string;
};

type BranchMachineContext = {
  currentBranch?: RestaurantBranch;
  currentRestaurantActor?: ActorRefFrom<typeof restaurantMachine>;
  restaurantActors: ActorRefFrom<typeof restaurantMachine>[];
};

type BranchMachineEvent = BranchUrlChangeEvent;

const branchMachine = setup({
  types: {
    context: {} as BranchMachineContext,
    events: {} as BranchMachineEvent,
  },
  actors: {
    restaurantMachine,
    branchUrlChange: fromEventObservable(() =>
      fromIndexSearch().pipe(
        map((search) => search.branch ?? "the-magic-city-grill"),
        distinctUntilChanged(),
        map(
          (branch): BranchUrlChangeEvent => ({
            type: "BRANCH_URL_CHANGE",
            branch,
          })
        )
      )
    ),
  },
  actions: {
    setCurrentBranch: assign((_, params: { branch: string }) => {
      console.log("set current branch");

      return {
        currentBranch: restaurantBranches.find(
          ({ id }) => id === params.branch
        ),
      };
    }),
    spawnNewRestaurant: assign(
      ({ spawn, context: { restaurantActors }, event }) => {
        const existingActor = restaurantActors.find(
          ({ id }) => id === event.branch
        );

        if (existingActor) {
          return {
            currentRestaurantActor: existingActor,
          };
        }

        const newRestaurantMachine = spawn("restaurantMachine", {
          id: event.branch,
          systemId: event.branch,
          input: {
            branch: event.branch,
          },
        });

        return {
          currentRestaurantActor: newRestaurantMachine,
          restaurantActors: restaurantActors.concat(newRestaurantMachine),
        };
      }
    ),
    logActiveEntry: () => console.log("active node entered"),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QCMBOBDAdgYwBYGIAhAJQEEA5AYQAkB9AVWIBlaaKBxAUQG0AGAXUSgADgHtYASwAuE0ZiEgAHogAsAJgA0IAJ6I1agBwA6AMwA2AJwB2CwEYzDxw4C+zrWix4j6bDIBuYERkVHSMLGzkXHyCSCBikjJyCsoIala2RmoArLy8tlnZBlYGFrxmWroItoZGWa5uIJiiEHAKHji4CvHSsvKxKQC05TqIQ67uGB3evhIBXeI9Sf16VlZGBvbq+bxFJWUVellmRqVm2eMg7V4SEAA2YPMJvcmItrYq61Y5vFZnFiYWFRZEwHKqWdaWGz2JyOerOIA */
  id: "branch",

  context: {
    restaurantActors: [],
  },
  initial: "idle",

  states: {
    active: {
      entry: "logActiveEntry",

      on: {
        BRANCH_URL_CHANGE: {
          target: "active",
          actions: [
            {
              type: "setCurrentBranch",
              params: ({ event: { branch } }) => ({ branch }),
            },
            "spawnNewRestaurant",
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
          params: ({ event: { branch } }) => ({ branch }),
        },
        "spawnNewRestaurant",
      ],
    },
  },
});

type BranchActor = Actor<typeof branchMachine>;
type BranchLogic = ActorLogicFrom<typeof branchMachine>

export type { BranchActor, BranchLogic };

export { branchMachine };
