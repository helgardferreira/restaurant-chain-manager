import {
  setup,
  sendTo,
  assign,
  Actor,
  ActorLogicFrom,
  fromEventObservable,
} from "xstate";
import { bind } from "@react-rxjs/core";

import { Meal } from "@/data/meals";
import { useGlobalActors } from "@/globalState";

import { kitchenMachine } from "./kitchen.machine";
import { frontOfHouseMachine } from "./frontOfHouse.machine";
import {
  BranchDirectorActor,
  BranchDirectorLogic,
} from "./branchDirector.machine";
import {
  fromChildActor,
  fromSystemActor,
  toActorState,
} from "../observables/utils";
import { ShortcutLogic } from "./shortcut.machine";
import { Observable, distinctUntilChanged, map } from "rxjs";

type RestaurantContext = {
  selectedMeals: Meal[];
  selectMultiple: boolean;
  branchId: string;
  revenue: number;
};

type AddMealToMenuEvent = { type: "ADD_MEAL_TO_MENU"; meal: Meal };
type AddMealsToMenuEvent = { type: "ADD_MEALS_TO_MENU" };
type RemoveMealFromMenuEvent = { type: "REMOVE_MEAL_FROM_MENU"; meal: Meal };
type RemoveMealsFromMenuEvent = { type: "REMOVE_MEALS_FROM_MENU" };
type SelectMealEvent = { type: "SELECT_MEAL"; meal: Meal };
type DeselectMealEvent = { type: "DESELECT_MEAL"; meal: Meal };
type SelectMultipleEvent = { type: "SELECT_MULTIPLE"; selectMultiple: boolean };
type OpenEvent = { type: "OPEN" };
type LastCallEvent = { type: "LAST_CALL" };
type CloseEvent = { type: "CLOSE" };
type ResetEvent = { type: "RESET" };
type PrepareEvent = { type: "PREPARE" };

type RestaurantEvent =
  | AddMealToMenuEvent
  | AddMealsToMenuEvent
  | RemoveMealFromMenuEvent
  | RemoveMealsFromMenuEvent
  | SelectMealEvent
  | DeselectMealEvent
  | SelectMultipleEvent
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
    checkModifier: fromEventObservable(
      ({ system }): Observable<SelectMultipleEvent> =>
        fromSystemActor<ShortcutLogic>(system, "shortcut").pipe(
          toActorState(({ context }) => context.modifiers.includes("Shift")),
          distinctUntilChanged(),
          map((selectMultiple) => ({
            type: "SELECT_MULTIPLE",
            selectMultiple,
          }))
        )
    ),
  },
  actions: {
    // This is a silly situation, `spawnChild` cannot be provided a function to access context it seems
    // so we have to use the spawn function from the assign action in order to spawn the kitchen machine
    // with the input branchId...
    spawnKitchen: assign(({ context: { branchId }, spawn }) => {
      spawn("kitchenMachine", {
        id: "kitchen",
        systemId: `${branchId}.kitchen`,
        input: {
          branchId,
        },
      });

      return {};
    }),
    spawnFrontOfHouse: assign(({ context: { branchId }, spawn }) => {
      spawn("frontOfHouseMachine", {
        id: "frontOfHouse",
        systemId: `${branchId}.frontOfHouse`,
      });

      return {};
    }),
    removeMealFromFrontOfHouseMenu: sendTo(
      "frontOfHouse",
      (_, params: { meal: Meal }) => ({
        type: "REMOVE_MEAL_FROM_MENU",
        meal: params.meal,
      })
    ),
    removeMealsFromFrontOfHouseMenu: sendTo(
      "frontOfHouse",
      (_, params: { meals: Meal[] }) => ({
        type: "REMOVE_MEALS_FROM_MENU",
        meals: params.meals,
      })
    ),
    addMealToFrontOfHouseMenu: sendTo(
      "frontOfHouse",
      (_, params: { meal: Meal }) => ({
        type: "ADD_MEAL_TO_MENU",
        meal: params.meal,
      })
    ),
    addMealsToFrontOfHouseMenu: sendTo(
      "frontOfHouse",
      (_, params: { meals: Meal[] }) => ({
        type: "ADD_MEALS_TO_MENU",
        meals: params.meals,
      })
    ),
    updateSelectMultiple: assign((_, params: { selectMultiple: boolean }) => {
      return {
        selectMultiple: params.selectMultiple,
      };
    }),
    setSelectedMeals: assign(
      (
        { context: { selectedMeals } },
        params: { meal: Meal; selectMultiple: boolean }
      ) => {
        const existingSelectIndex = selectedMeals.findIndex(
          (m) => m.id === params.meal.id
        );

        if (params.selectMultiple) {
          if (existingSelectIndex !== -1) {
            return {
              selectedMeals: selectedMeals
                .slice(0, existingSelectIndex)
                .concat(selectedMeals.slice(existingSelectIndex + 1)),
            };
          }

          return {
            selectedMeals: selectedMeals.concat(params.meal),
          };
        } else {
          if (existingSelectIndex !== -1) {
            if (selectedMeals.length > 1) {
              return { selectedMeals: [params.meal] };
            }
            return { selectedMeals: [] };
          }

          return { selectedMeals: [params.meal] };
        }
      }
    ),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QCc4BcCGBXZGB2aAdAA6rEbICWeUAxAPIAKAogHIDaADALqKjEB7WJTSUBePiAAeiAMyyAbIQCsAdk6zVAJmVqAnKoAsagDQgAnogAchpVa0BGPcoWqHDhbM4KAvj7OosJg4+ESkYORUNLQAggAicQD6ALLMMQAyiQAq9ClsAKpcvEgggsKi4pIyCO6yhA6Gxsqcyu7Ohi1mlgiNdVaqelpW9jpWynrGfgHo2LgEJGQU1HTxSakZAMrZuamshTySZSJiEiXV7pyEms1Gmg5WDloGXXKGqoSGWgqcqspjejZDA4piBAsE5mFFlE6AAlZjJegANWYeQyiQAYjD6Mk8nsiochMdKmdEM5CI5DFZnKoFPdVFZZMoXggdJcDE8AXoHN5OE5VCCwbNQgsIktonCEcjUektpjsbj9sV+ISKqdQNVBsyHMpDConIMnLTGQDDAKZiF5uFIstCLAwAAbMAAY1E0Q2zHSzAAwllpfiSkdVVVENytB9hl5aZxeWpZFpmVYfoRVLJ+gNGf0FKb-KDzRCRdaaLaHc7XXQ4sx3Z6fX6DgGVSdgwg9HpCIM-g1DACfs8LIg3A5yWMXAoW1ojGMzUEhZaoTa7Y6XctaFXvb7kvl0lkAJKMT3+5XlRsk5th2naDNaRQ0nXM2m6hlXnUKL4p2RT8HCgTEMB4WjpGINl9L0MnSA9SgbYl1UQZRZEHb4Ji7ThBkzBQE1sQh7CcFwB08bwPxnIgnXtQlxUrZgsnAwNj2ghBU11R5mieT5eVkSlVC1HQlFHBx1C7bUr0ZAiLTCIQ0C9EjhBoGI8AgGE4DANBaEYOFGBiOEqMgtVpBDeM+xqLRhPze0MCCL0MHte1aC9dJ6HdTSjygnSagUZRCG8HRDHkNjbGUL5OJcQgeL4rk-PkZQ-BzPABAgOBJEFESCUc7TqgAWkUZlUoaKwPhbA09CNcYrF8HMEvzK0xSgJKiRS15yWyrkeO1Z9mT8955CvVzeNaXkSumacRILSri0XMtqqDE97HqylGq5ZrbGZPRkPqLltE4KlHjjPrcwG-Nv1-caaOcxpBx+B4s0UR5nD07obHaxxhiWjQtEaIzhWI0iqvrZKm3Hd4b1HFo-NsLwOP0xj3ice4Og66N+VKvNhTKcTJOWGS5IUtBDqc6pTHB1ocqh1QaS5F6-kMhHduFEyzIs+1sdqhA8e6CGVuhjQ4zhyKfCAA */
  id: "restaurant",

  context: ({ input: { branchId } }) => ({
    selectedMeals: [],
    selectMultiple: false,
    branchId,
    revenue: 0,
  }),

  initial: "preparing",

  states: {
    preparing: {
      on: {
        OPEN: {
          target: "open",
        },

        ADD_MEAL_TO_MENU: {
          target: "preparing",
          actions: {
            type: "addMealToFrontOfHouseMenu",
            params: ({ event }) => ({ meal: event.meal }),
          },
        },

        ADD_MEALS_TO_MENU: {
          target: "preparing",
          actions: {
            type: "addMealsToFrontOfHouseMenu",
            params: ({ context }) => ({ meals: context.selectedMeals }),
          },
        },

        REMOVE_MEAL_FROM_MENU: {
          target: "preparing",
          actions: {
            type: "removeMealFromFrontOfHouseMenu",
            params: ({ event }) => ({ meal: event.meal }),
          },
        },

        REMOVE_MEALS_FROM_MENU: {
          target: "preparing",
          actions: {
            type: "removeMealsFromFrontOfHouseMenu",
            params: ({ context }) => ({ meals: context.selectedMeals }),
          },
        },
      },

      states: {
        selecting: {
          on: {
            SELECT_MEAL: {
              target: "selecting",

              actions: {
                type: "setSelectedMeals",
                params: ({ context, event }) => ({
                  meal: event.meal,
                  selectMultiple: context.selectMultiple,
                }),
              },
            },

            DESELECT_MEAL: {
              target: "selecting",

              actions: {
                type: "setSelectedMeals",
                params: ({ context, event }) => ({
                  meal: event.meal,
                  selectMultiple: context.selectMultiple,
                }),
              },
            },

            SELECT_MULTIPLE: {
              target: "selecting",
              actions: {
                type: "updateSelectMultiple",
                params: ({ event }) => ({
                  selectMultiple: event.selectMultiple,
                }),
              },
            },
          },

          invoke: {
            src: "checkModifier",
          },
        },
      },

      initial: "selecting",
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
      on: { PREPARE: "preparing" },
    },

    lastCall: {
      on: {
        CLOSE: {
          target: "closing",
        },
      },
    },
  },

  entry: ["spawnKitchen", "spawnFrontOfHouse"],
});

const [useRestaurantFromBranch, fromCurrentRestaurantActor] = bind(
  (branchDirectorActor: BranchDirectorActor) =>
    fromChildActor<RestaurantLogic, BranchDirectorLogic>(
      branchDirectorActor,
      ({ context }) => context.currentRestaurantActor
    )
);

function useCurrentRestaurantActor() {
  const { branchDirectorActor } = useGlobalActors();
  return useRestaurantFromBranch(branchDirectorActor);
}

type RestaurantActor = Actor<typeof restaurantMachine>;
type RestaurantLogic = ActorLogicFrom<typeof restaurantMachine>;

export type { RestaurantActor, RestaurantLogic };

export {
  restaurantMachine,
  useCurrentRestaurantActor,
  fromCurrentRestaurantActor,
};
