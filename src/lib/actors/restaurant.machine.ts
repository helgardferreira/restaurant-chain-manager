import {
  setup,
  spawnChild,
  sendTo,
  assign,
  Actor,
  ActorLogicFrom,
} from "xstate";

import { Meal, ingredients } from "@/data/meals";
import { IngredientStock } from "@/components/stock-overview/types";
import { hashStringToNumber, randomWithSeed } from "../utils";

type AddMealEvent = {
  type: "ADD_MEAL";
  meal: Meal;
};

type KitchenContext = {
  menu: Meal[];
  stock: IngredientStock[];
};

type KitchenEvent = AddMealEvent;

type KitchenInput = {
  branch: string;
};

const kitchenMachine = setup({
  types: {} as {
    context: KitchenContext;
    events: KitchenEvent;
    input: KitchenInput;
  },
  actions: {
    addMealToMenu: (_, params: { meal: Meal }) => {
      // console.log(params.meal)
    },
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QGsCWAXAxgCzAOwDoBDTdVANzAGIBBAEToH0BZAURoBkBtABgF1EoAA4B7WBlQi8gkAA9EAFgBMAGhABPRAA4AjAQCsPIzp5aAnCYDMWrQoC+DtXhEQ4MtFlzSkIUeLJSMvIIALQAbGqaoWGOIB44+MSkFGAyfhKBPsEA7FoE2QWWCmZaPJY8Ctk6qhqIOlpKBGb6ljphSqU6+mZhCvoODkA */
  id: "kitchen",

  context: ({ input: { branch } }): KitchenContext => {
    console.log({ branch });
    const seed = hashStringToNumber(branch);

    const stock = ingredients.map((ingredient, i) => ({
      ...ingredient,
      // excess: Math.floor(Math.random() * 10 + 2),
      excess: randomWithSeed(seed + i, 4, 20),
      current: 0,
      inMenu: 0,
    }));

    return {
      menu: [],
      stock,
    };
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
  branch: string;
};

type ViewMealEvent = { type: "VIEW_MEAL"; meal: Meal };
type ClearMealEvent = { type: "CLEAR_MEAL" };
type RestaurantEvent = AddMealEvent | ViewMealEvent | ClearMealEvent;

type RestaurantInput = {
  branch: string;
};

const restaurantMachine = setup({
  types: {} as {
    context: RestaurantContext;
    events: RestaurantEvent;
    input: RestaurantInput;
  },
  actions: {
    spawnKitchen: ({ context: { branch } }) =>
      spawnChild(kitchenMachine, {
        id: "kitchen",
        input: {
          branch,
        },
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

  context: ({ input: { branch } }) => ({
    currentMealView: undefined,
    branch,
  }),

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

type KitchenActor = Actor<typeof kitchenMachine>;
type KitchenLogic = ActorLogicFrom<typeof kitchenMachine>;
type RestaurantActor = Actor<typeof restaurantMachine>;
type RestaurantLogic = ActorLogicFrom<typeof restaurantMachine>;

export type { KitchenActor, KitchenLogic, RestaurantActor, RestaurantLogic };

export { restaurantMachine };
