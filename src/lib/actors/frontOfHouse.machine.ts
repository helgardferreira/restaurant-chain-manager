import { ActorLogicFrom, assign, setup } from "xstate";
import { bind } from "@react-rxjs/core";
import { differenceBy, unionBy } from "lodash";

import { Meal } from "@/data/meals";
import { useGlobalActors } from "@/globalState";
import { fromCurrentRestaurantActor } from "./restaurant.machine";
import { toChildActor } from "../observables/utils";
import { BranchDirectorActor } from "./branchDirector.machine";

type FrontOfHouseMachineContext = {
  menu: Meal[];
};

type AddMealToMenuEvent = { type: "ADD_MEAL_TO_MENU"; meal: Meal };
type AddMealsToMenuEvent = { type: "ADD_MEALS_TO_MENU"; meals: Meal[] };
type RemoveMealFromMenuEvent = { type: "REMOVE_MEAL_FROM_MENU"; meal: Meal };
type RemoveMealsFromMenuEvent = {
  type: "REMOVE_MEALS_FROM_MENU";
  meals: Meal[];
};
type PrepareEvent = { type: "PREPARE" };
type ReadyEvent = { type: "READY" };
type CloseEvent = { type: "CLOSE" };
type FrontOfHouseMachineEvent =
  | AddMealToMenuEvent
  | AddMealsToMenuEvent
  | RemoveMealFromMenuEvent
  | RemoveMealsFromMenuEvent
  | PrepareEvent
  | ReadyEvent
  | CloseEvent;

const frontOfHouseMachine = setup({
  types: {} as {
    context: FrontOfHouseMachineContext;
    events: FrontOfHouseMachineEvent;
  },
  actions: {
    addMeal: assign(({ context: { menu } }, params: { meal: Meal }) => {
      const existingMealIndex = menu.findIndex((m) => m.id === params.meal.id);
      if (existingMealIndex !== -1) return {};
      return { menu: menu.concat(params.meal) };
    }),
    addMeals: assign(({ context: { menu } }, params: { meals: Meal[] }) => {
      const newMenu = unionBy(menu, params.meals, "id");
      return { menu: newMenu };
    }),
    removeMeal: assign(({ context: { menu } }, params: { meal: Meal }) => {
      const existingMealIndex = menu.findIndex((m) => m.id === params.meal.id);
      if (existingMealIndex === -1) return {};
      return { menu: menu.filter((m) => m.id !== params.meal.id) };
    }),
    removeMeals: assign(({ context: { menu } }, params: { meals: Meal[] }) => {
      const newMenu = differenceBy(menu, params.meals, "id");
      return { menu: newMenu };
    }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QDMBOB7AdgFwPLIAl0BXWMAOgEsIAbMAYgAUAlAUUYEE2BtABgF1EoAA7pYlbJSxCQAD0QBWAMwB2cgEYALAA5NmgExLeKnSvUAaEAE9EShQE4NmhdoBs6ldv0qFzgL5+lmhYeIQkZOTCqGDCAIaolJhQ9GwcACIAmnyCSCCi4pLSufIISvoK5HrK6uWWNgiaKo7a9i6uCrya9tpKmuoBQRg4+ESkFFEx8YnJ6WkA+gCyrBwAMnMAKriLrAByAKrZMvkSUpgyJSbk9l36vA5d9rzlSnW2Krzk2vfqvK5GyvZ+oEQMFhmExpFonEEkl6LNtqsAMobLZLfaHXLHQpnYqId7kXheXhlTTEx5uFSvBDeTSVX76R5-JSuToDEFDUKjCITaHTFKsBa4ABqrARawAYsxcAttuiBEcxCciqASppXJ9XGYetpfqo1ZTrIgPGpWkoah1eJara42aDOeEKLEAMaSABuDAAwitcIjWBiRIrsedFKonLoDEYTNozFTGs1Wm4Ol0en1bRyRg7IZMYck2IKRWLkZLpbKDvLMYHTsGGvoqdp1OQFAFgZh0BA4DI7RmxgqClXcQgALSuKnDglW4yuBlKa7VNMhbsRah0XtKnEqxCuLefBTqBQKKcubzuWOXevPekmEz6edgrnjKFTJKroMDmoNll75SdfTaXT2WtDQaFR9HIM0LynK8DFve0IWdN0wBffsNwaJRtCuexMK8NVo21WMdTAhN2k6bpeiBAIgA */
  id: "frontOfHouse",

  context: {
    menu: [],
  },

  initial: "preparing",

  states: {
    idle: {
      on: {
        PREPARE: "preparing",
      },
    },

    preparing: {
      on: {
        READY: "active",

        ADD_MEAL_TO_MENU: {
          target: "preparing",
          actions: {
            type: "addMeal",
            params: ({ event }) => ({ meal: event.meal }),
          },
        },

        ADD_MEALS_TO_MENU: {
          target: "preparing",
          actions: {
            type: "addMeals",
            params: ({ event }) => ({ meals: event.meals }),
          },
        },

        REMOVE_MEAL_FROM_MENU: {
          target: "preparing",
          actions: {
            type: "removeMeal",
            params: ({ event }) => ({ meal: event.meal }),
          },
        },

        REMOVE_MEALS_FROM_MENU: {
          target: "preparing",
          actions: {
            type: "removeMeals",
            params: ({ event }) => ({ meals: event.meals }),
          },
        },
      },
    },

    active: {
      on: {
        CLOSE: "idle",
      },
    },
  },
});

const [useFrontOfHouseFromBranch, fromCurrentFrontOfHouseActor] = bind(
  (branchDirectorActor: BranchDirectorActor) =>
    fromCurrentRestaurantActor(branchDirectorActor).pipe(
      toChildActor<FrontOfHouseLogic>("frontOfHouse")
    )
);

function useCurrentFrontOfHouseActor() {
  const { branchDirectorActor } = useGlobalActors();
  return useFrontOfHouseFromBranch(branchDirectorActor);
}

type FrontOfHouseLogic = ActorLogicFrom<typeof frontOfHouseMachine>;

export type { FrontOfHouseLogic };

export {
  frontOfHouseMachine,
  useCurrentFrontOfHouseActor,
  fromCurrentFrontOfHouseActor,
};
