import { setup, spawnChild, sendTo, assign } from "xstate";

import { Meal } from "@/data/meals";

type AddMealEvent = {
  type: "ADD_MEAL";
  meal: Meal;
};

type KitchenContext = {
  menu: Meal[];
};

type KitchenEvent = AddMealEvent;

const kitchenMachine = setup({
  types: {} as {
    context: KitchenContext;
    events: KitchenEvent;
  },
  actions: {
    addMealToMenu: (_, params: { meal: Meal }) => console.log(params.meal),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QGsCWAXAxgCzAOwDoBDTdVANzAGIBlAUQBUB9AEQEEBJAGQE0maACnQDCHNlwDaABgC6iUAAcA9rAyoleeSAAeiACwAmADQgAnogCMBgBwEArAF8nJvEohwtaLLk1IQy1TINLV0EAFoANhNzcIjnEC8cfGJSCjAtALVgv1CATgiCKQB2ays7aMQDA1yCXLsAZjKnJyA */
  id: "kitchen",

  context: {
    menu: [],
  },

  initial: "active",

  states: {
    active: {
      on: {
        ADD_MEAL: {
          target: "active",
          actions: {
            type: "addMealToMenu",
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
type RestaurantEvent = AddMealEvent | ViewMealEvent | ClearMealEvent;

const restaurantMachine = setup({
  types: {} as {
    context: RestaurantContext;
    events: RestaurantEvent;
  },
  actions: {
    spawnKitchen: spawnChild(kitchenMachine, {
      id: "kitchen",
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
  /** @xstate-layout N4IgpgJg5mDOIC5QCc4BcCGBXZGB2aAdBgMZoCWAbmAMQCCAIgwPoCyAonQDIDaADAF1EoAA4B7WOQpi8wkAA9EAVgAchAIwA2PuqWaATEoA0IAJ6IAzPvWEALHwNKAvk5OpYmHPiKkK1GgBqAJLsAOpsnLyCcuKS0rJICoi2AOwaKUopKuqGJuYI+vq2hACcShY5zq4g7p64BMRkVLQAwlycAEoR3PxCibFS5DJyigi2+nmIOWpV1XhiEHBytdj1aDESg8OJowC0mpMI+y5u6KvejX5gG3FDCaCjJcUlFhmH4-qEKkovGS4uQA */
  id: "restaurant",

  context: {
    currentMealView: undefined,
  },

  initial: "active",

  states: {
    active: {
      on: {
        ADD_MEAL: {
          target: "active",
          actions: {
            type: "addMealToMenu",
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
