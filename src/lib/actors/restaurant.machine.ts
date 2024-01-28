import { setup, spawnChild, sendTo, assign } from "xstate";

import { BurgerSpecial } from "@/data/burgerSpecials";

type SetDailySpecialEvent = {
  type: "SET_DAILY_SPECIAL";
  special: BurgerSpecial;
};

type KitchenContext = object;

type KitchenEvent = SetDailySpecialEvent;

const kitchenMachine = setup({
  types: {} as {
    context: KitchenContext;
    events: KitchenEvent;
  },
  actions: {
    setDailySpecial: ({ event: { special } }) => console.log(special),
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
          actions: "setDailySpecial",
        },
      },
    },
  },
});

type RestaurantContext = {
  currentSpecial: BurgerSpecial | undefined;
};

type ViewSpecialEvent = { type: "VIEW_SPECIAL"; special: BurgerSpecial };
type RestaurantEvent = SetDailySpecialEvent | ViewSpecialEvent;

const restaurantMachine = setup({
  types: {} as {
    context: RestaurantContext;
    events: RestaurantEvent;
  },
  actions: {
    spawnKitchen: spawnChild(kitchenMachine, {
      id: "kitchen",
    }),
    setDailySpecial: sendTo(
      "kitchen",
      (_, params: { special: BurgerSpecial }) => ({
        type: "SET_DAILY_SPECIAL",
        special: params.special,
      })
    ),
    setCurrentSpecial: assign((_, params: { special: BurgerSpecial }) => ({
      currentSpecial: params.special,
    })),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QCc4BcCGBXZGB2aAdBgMZoCWAbmAMQDKAogCoD6AIgIICSAMgJos6ABQYBhLhx4BtAAwBdRKAAOAe1jkKKvIpAAPRABYATABoQAT0RGjBwgE4ArAGYAjEYcBfD2dSxMOfCJSCmoaADUuBgB1QRFxSVkFJBBVdU1tZP0EBwdCAwA2AA4AdgczSwQ3QsJPLzM8FQg4HV9-XAIdVI1yLR0sgFp88sRBupBW7HagsiowTrVu3szEO3zCGWLCtzKLRCcjNYMZfPcvLyA */
  id: "restaurant",

  context: {
    currentSpecial: undefined,
  },

  initial: "active",

  states: {
    active: {
      on: {
        SET_DAILY_SPECIAL: {
          target: "active",
          actions: {
            type: "setDailySpecial",
            params: ({ event }) => ({ special: event.special }),
          },
        },

        VIEW_SPECIAL: {
          target: "active",
          actions: {
            type: "setCurrentSpecial",
            params: ({ event }) => ({ special: event.special }),
          },
        },
      },
    },
  },

  entry: "spawnKitchen",
});

export { restaurantMachine };
