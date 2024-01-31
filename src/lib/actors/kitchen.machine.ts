import { Actor, ActorLogicFrom, setup, spawnChild } from "xstate";

import { ingredients } from "@/data/meals";

import { hashStringToNumber, randomWithSeed } from "../utils";
import { IngredientStock } from "../types";

// TODO: REMOVE EXAMPLE
type ChefMachineContext = {
  name: string;
};

type InitEvent = { type: "INIT" };
type ChefMachineEvent = InitEvent;

const chefMachine = setup({
  types: {} as {
    context: ChefMachineContext;
    events: ChefMachineEvent;
  },
}).createMachine({
  id: "chef",

  context: {
    name: "John",
  },

  initial: "idle",

  states: {
    idle: {},
  },
});

export type ChefLogic = ActorLogicFrom<typeof chefMachine>;

// TODO: REMOVE EXAMPLE

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
  actors: {
    chefMachine,
  },
  actions: {
    spawnChefs: spawnChild("chefMachine", { id: "chef" }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QGsCWAXAxgCzAOwDoBDTdVANzAGIBhAGQHkBlAUQG0AGAXUVAAcA9rAyoBeXiAAeiAMwAOAKwEATAE4AbHPUcAjABY5egOwdlAGhABPRHJ0EFHRxwUy9e9UZkuAvt4tosXEJUCAAbagAFACUWCIBBGM4eJBBBYTIxCWkEHRkOewtrBGVTFT1VVTlDd2dVHV9-DBx8Aj4AJzA+IjbUPCgqGLiAEQBNJIk0kUyU7Pk9AjcFNSNlPR1lHQ5VPULEEuUyiqq3bQU63z8QPAEIOAkA5vEUyYyn0GyAWnVdhA+lCqOqiMhk2eQURgaIAeQWIpAoYAmQimbykiHKRgIAMqxjWGy2OysiFU+Q4chkMg2RiMqhkqlWMkh0JaIXCiPSohR2T05kJCDkGIUZIpOipNLpegZlyZhHanW6vSgbORWT22hUHBk6wUP32BCM5Uq1VO5wuQA */
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

  entry: "spawnChefs",
});

type KitchenActor = Actor<typeof kitchenMachine>;
type KitchenLogic = ActorLogicFrom<typeof kitchenMachine>;

export type { KitchenActor, KitchenLogic };

export { kitchenMachine };
