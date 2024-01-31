import {
  setup,
  spawnChild,
  sendTo,
  assign,
  Actor,
  ActorLogicFrom,
} from "xstate";

import { Meal } from "@/data/meals";

import { kitchenMachine } from "./kitchen.machine";
import { frontOfHouseMachine } from "./frontOfHouse.machine";

type RestaurantContext = {
  menu: Meal[];
  currentMealView: Meal | undefined;
  branchId: string;
};

type AddMealEvent = { type: "ADD_MEAL"; meal: Meal };
type ViewMealEvent = { type: "VIEW_MEAL"; meal: Meal };
type ClearMealEvent = { type: "CLEAR_MEAL" };
type OpenEvent = { type: "OPEN" };
type LastCallEvent = { type: "LAST_CALL" };
type CloseEvent = { type: "CLOSE" };
type ResetEvent = { type: "RESET" };
type PrepareEvent = { type: "PREPARE" };

type RestaurantEvent =
  | AddMealEvent
  | ViewMealEvent
  | ClearMealEvent
  | OpenEvent
  | LastCallEvent
  | CloseEvent
  | ResetEvent
  | PrepareEvent;

type RestaurantInput = {
  branchId: string;
};

const restaurantMachine = setup({
  types: {} as {
    context: RestaurantContext;
    events: RestaurantEvent;
    input: RestaurantInput;
  },
  actors: {
    kitchenMachine,
    frontOfHouseMachine,
  },
  actions: {
    // This is a silly situation, `spawnChild` cannot be provided a function to access context it seems
    // so we have to use the spawn function from the assign action in order to spawn the kitchen machine
    // with the input branchId...
    spawnKitchen: assign(({ context: { branchId }, spawn }) => {
      spawn("kitchenMachine", {
        id: "kitchen",
        input: {
          branchId,
        },
      });

      return {};
    }),
    spawnFrontOfHouse: spawnChild("frontOfHouseMachine", {
      id: "frontOfHouse",
    }),
    addMealToMenu: sendTo("kitchen", (_, params: { meal: Meal }) => ({
      type: "ADD_MEAL",
      meal: params.meal,
    })),
    setCurrentMealView: assign((_, params: { meal: Meal }) => ({
      currentMealView: params.meal,
    })),
    clearCurrentMealView: assign(() => ({
      currentMealView: undefined,
    })),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QCc4BcCGBXZGB2aAdAA6rEDEAggCLUD6AsgKKUAyA2gAwC6ioxAe1gBLNMIF4+IAB6IArAA5CARgBsnZXNWqALJwVy5euQBoQAT0QBmHQHZCe1QCYFq5TatOAnE9UBfPzNUWEwcfCJSMAoANQBJJgB1RhYOHilBETEJKVkEOxVbOVtbZR0rOWUfHR1TC0QnOU5CLzkrUr0GyqtbAKD0bFwCEjJyAGFWFgAlZLYuXiQQDNFxSQXcnSczSwRNHUJGzkPKtU5FTh7AkGDQwYiRgHkABSYAOTn0oWXstfqdVUJOE4bCcFDYNMpbFtEDV-tUnLYrKpGt0gU5eld+mEhgJiGA8ORWJQAMoAFToozYqXm-E+WVWoHWOmUAOcdnUnBaCi82iheS0Dg2CKRnBRnnR1wG4UIAGMADafPBQciTJhEpgk94LJZ0nKILylQigxS2VSFc5tSF1PmwwWI5G2VHizG3EhCNCjeUiRWUPAQSZwMBociPFWPSgqzU0zIrXUIfV7I0KE1mhEQ3lWcqEVQ+Eo+ZSnPM6J0hSVDWUYEKjDCy2VjVj3NWRxa0mM-BDZuSEYrA1TdTim7q8mEC+F2kUOsXovACCBwKQSrFoD7R74MxAAWlUvM3AMOe-3e9KxZuUsixGXX3pMkQ+aaVi8-fcTlK3Tk3iHOiUBi8VgUlSTLiqAoRaXAuLo4niF46m25RNK0yjPiaD7nD4Q78l4GzZoCdhGG+x6lkQcoKlAUGtmuCAKPoDgmhUhR-GoqFWsOGG+A+Tg4TUaKgc6p5uh6xE+n6AZLlqLarteOycNU+y-i0cgtC4OheGhzLlD+FSlF4oKfvhi6EOWlbVrKpHibkxpdvmD5-HmHI6Gh-wsVh7F0XhAR+EAA */
  id: "restaurant",

  context: ({ input: { branchId } }) => ({
    currentMealView: undefined,
    menu: [],
    branchId,
  }),

  initial: "prep",

  states: {
    prep: {
      on: {
        ADD_MEAL: {
          target: "prep",
          actions: {
            type: "addMealToMenu",
            params: ({ event }) => ({ meal: event.meal }),
          },
        },

        VIEW_MEAL: {
          target: "prep",
          actions: {
            type: "setCurrentMealView",
            params: ({ event }) => ({ meal: event.meal }),
          },
        },

        CLEAR_MEAL: {
          target: "prep",
          actions: "clearCurrentMealView",
        },

        OPEN: {
          target: "open",
          reenter: true,
        },
      },
    },

    open: {
      on: {
        LAST_CALL: "lastCall",
      },
    },

    closing: {
      on: { RESET: "postClosingAndReset" },
    },

    postClosingAndReset: {
      on: { PREPARE: "prep" },
    },

    lastCall: {
      on: {
        CLOSE: {
          target: "closing",
          reenter: true,
        },
      },
    },
  },

  entry: ["spawnKitchen", "spawnFrontOfHouse"],
});

type RestaurantActor = Actor<typeof restaurantMachine>;
type RestaurantLogic = ActorLogicFrom<typeof restaurantMachine>;

export type { RestaurantActor, RestaurantLogic };

export { restaurantMachine };
