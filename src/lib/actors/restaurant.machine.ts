import { setup, spawnChild, sendTo, assign } from "xstate";

import { Meal } from "@/data/meals";

type SetDailySpecialEvent = {
  type: "SET_DAILY_SPECIAL";
  meal: Meal;
};

type KitchenContext = object;

type KitchenEvent = SetDailySpecialEvent;

const kitchenMachine = setup({
  types: {} as {
    context: KitchenContext;
    events: KitchenEvent;
  },
  actions: {
    setDailySpecial: (_, params: { meal: Meal }) => console.log(params.meal),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QGsCWAXAxgCzAOwDoBDTdVANzAGIBlAUQBUB9AEQEEBJAGQE0maACnQDCHNlwDaABgC6iUAAcA9rAyoleeSAAeiACwAmADQgAnogCMBgBwEArAF8nJvEohwtaLLk1IQy1TINLV0EAFoANhNzcIjnEC8cfGJSCjAtALVgv1CATgiCKQB2ays7aMQDA1yCXLsAZjKnJyA */
  id: "kitchen",

  context: {},

  initial: "active",

  states: {
    active: {
      on: {
        SET_DAILY_SPECIAL: {
          target: "active",
          actions: {
            type: "setDailySpecial",
            params: ({ event }) => ({ meal: event.meal }),
          },
        },
      },
    },
  },
});

type RestaurantContext = {
  currentMealView: Meal | undefined;
};

type ViewMealEvent = { type: "VIEW_MEAL"; meal: Meal };
type ClearMealEvent = { type: "CLEAR_MEAL" };
type RestaurantEvent = SetDailySpecialEvent | ViewMealEvent | ClearMealEvent;

const restaurantMachine = setup({
  types: {} as {
    context: RestaurantContext;
    events: RestaurantEvent;
  },
  actions: {
    spawnKitchen: spawnChild(kitchenMachine, {
      id: "kitchen",
    }),
    setDailySpecial: sendTo("kitchen", (_, params: { meal: Meal }) => ({
      type: "SET_DAILY_SPECIAL",
      special: params.meal,
    })),
    setCurrentMealView: assign((_, params: { meal: Meal }) => ({
      currentMealView: params.meal,
    })),
    clearCurrentMealView: assign(() => ({
      currentMealView: undefined,
    })),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QCc4BcCGBXZGB2aAdBgMZoCWAbmAMQDKAogCoD6AIgIICSAMgJos6ABQYBhLhx4BtAAwBdRKAAOAe1jkKKvIpAAPRABYATABoQAT0QBmIwEZCBmQDYjAVgC+7s6liYc+IlIKahoANS4GAHUWAFkGSVkFJBBVdU1tZP0EAwAOQitbJ0cXVzNLBCMjA0IATlcCt09vdGxcAmIyKlpRHniAJVj46XkdVI1yLR0sgytCW2K3MsRbIzyPJpA8FQg4HR8-NrRRtXHJzMQAWiclhCuN-daAjuCwY7SJjNAsmqdCGQB2HIrUoWQyVQg5Vw1Kz-daeIA */
  id: "restaurant",

  context: {
    currentMealView: undefined,
  },

  initial: "active",

  states: {
    active: {
      on: {
        SET_DAILY_SPECIAL: {
          target: "active",
          actions: {
            type: "setDailySpecial",
            params: ({ event }) => ({ meal: event.meal }),
          },
        },

        VIEW_MEAL: {
          target: "active",
          actions: {
            type: "setCurrentMealView",
            params: ({ event }) => ({ meal: event.meal }),
          },
        },

        CLEAR_MEAL: {
          target: "active",
          actions: "clearCurrentMealView",
        },
      },
    },
  },

  entry: "spawnKitchen",
});

export { restaurantMachine };
