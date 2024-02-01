import { Actor, ActorLogicFrom, setup } from "xstate";
import { bind } from "@react-rxjs/core";

import { ingredients } from "@/data/meals";

import { useGlobalActors } from "@/globalState";
import { hashStringToNumber, randomWithSeed } from "../utils";
import { IngredientStock } from "../types";

import type { BranchDirectorActor } from "./branchDirector.machine";
import { fromCurrentRestaurantActor } from "./restaurant.machine";
import { toChildActor } from "../observables/utils";

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
  actors: {},
  actions: {},
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
});

const [useKitchenFromBranch, fromCurrentKitchenActor] = bind(
  (branchDirectorActor: BranchDirectorActor) =>
    fromCurrentRestaurantActor(branchDirectorActor).pipe(
      toChildActor<KitchenLogic>("kitchen")
    )
);

function useCurrentKitchenActor() {
  const { branchDirectorActor } = useGlobalActors();
  return useKitchenFromBranch(branchDirectorActor);
}

type KitchenActor = Actor<typeof kitchenMachine>;
type KitchenLogic = ActorLogicFrom<typeof kitchenMachine>;

export type { KitchenActor, KitchenLogic };

export { kitchenMachine, useCurrentKitchenActor, fromCurrentKitchenActor };
