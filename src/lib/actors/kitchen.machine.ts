import { Actor, ActorLogicFrom, setup } from "xstate";

import { ingredients } from "@/data/meals";

import { hashStringToNumber, randomWithSeed } from "../utils";
import { IngredientStock } from "../types";

type KitchenContext = {
  stock: IngredientStock[];
};

type PrepareEvent = { type: "PREPARE" };
type ReadyEvent = { type: "READY" };
type CloseEvent = { type: "CLOSE" };
type KitchenEvent = PrepareEvent | ReadyEvent | CloseEvent;

type KitchenInput = {
  branchId: string;
};

const kitchenMachine = setup({
  types: {} as {
    context: KitchenContext;
    events: KitchenEvent;
    input: KitchenInput;
  },
  actions: {},
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QGsCWAXAxgCzAOwDoBDTdVANzAGIBhAGQHkBlAUQG0AGAXUVAAcA9rAyoBeXiAAeiAMwAOAKwEATAE4AbHPUcAjABY5egOwdlAGhABPRHJ0EFHRxwUy9e9UZkuAvt4tosXEJUCAAbagAFACUWCIBBGM4eJBBBYTIxCWkEHRkOewtrBGVTFT1VVTlDd2dVHV9-DBx8Aj4AJzA+IjbUPCgqGLiAEQBNJIk0kUyU7Pk9AjcFNSNlPR1lHQ5VPULEEuUyiqq3bQU63z8QPAEIOAkA5vEUyYyn0GyAWnVdhA+lCoqRlUMg0LiMa2UDRADyCxFIFDAEyEUzeUkQ5SMBABlWMEM22x+qnyHDkMhkGyMQJBqxkUJhLRC4SR6VEqOyenMVhsmIUpPJOkpwNUNLpTVh7U63V6UGZKKye20Kg4MnWCh++wI4KO1VO5wuQA */
  id: "kitchen",

  context: ({ input: { branchId } }): KitchenContext => {
    const seed = hashStringToNumber(branchId);

    const stock = ingredients.map((ingredient, i) => ({
      ...ingredient,
      // excess: Math.floor(Math.random() * 10 + 2),
      excess: randomWithSeed(seed + i, 4, 20),
      current: 0,
      inMenu: 0,
    }));

    return {
      stock,
    };
  },

  initial: "idle",

  states: {
    active: {
      on: {
        CLOSE: "idle",
      },
    },

    idle: {
      on: {
        PREPARE: "preparing",
      },
    },

    preparing: {
      on: {
        READY: "active",
      },
    },
  },
});

type KitchenActor = Actor<typeof kitchenMachine>;
type KitchenLogic = ActorLogicFrom<typeof kitchenMachine>;

export type { KitchenActor, KitchenLogic };

export { kitchenMachine };
