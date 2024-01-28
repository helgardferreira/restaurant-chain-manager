import { setup, spawnChild, sendTo } from "xstate";

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
    setDailySpecial: ({ event: { special } }) => console.log({ special }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QGsCWAXAxgCzAOwDoBDTdVANzAGIBlAUQBUB9AEQEEBJAGQE0maACnQDCHNlwDaABgC6iUAAcA9rAyoleeSAAeiACwAmADQgAnogCMBgBwEArAF8nJvEohwtaLLk1IQy1TINLV0EAFoANhNzcIjnEC8cfGJSCjAtALVgv1CATgiCKQB2ays7aMQDA1yCXLsAZjKnJyA */
  id: "kitchen",
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

type RestaurantContext = object;
type RestaurantEvent = SetDailySpecialEvent;

const restaurantMachine = setup({
  types: {} as {
    context: RestaurantContext;
    events: RestaurantEvent;
  },
  actions: {
    spawnKitchen: spawnChild(kitchenMachine, {
      id: "kitchen",
    }),
    setDailySpecial: sendTo("kitchen", ({ event }) => ({
      type: "SET_DAILY_SPECIAL",
      special: event.special,
    })),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QCc4BcCGBXZGB2aAdBgMZoCWAbmAMQDKAogCoD6AIgIICSAMgJos6ABQYBhLhx4BtAAwBdRKAAOAe1jkKKvIpAAPRABYATABoQAT0QBGIwA5CAVgC+Ls3hUQ4O1LEw58aDqq6praSHqIALQAbGaWCDGuID5+uATEZFRgQWoa5Fo6+ggAnNGEMgDstjYOcYhGRsWExQ4AzDUuLkA */
  id: "restaurant",

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

  entry: "spawnKitchen",
});

export { restaurantMachine };
