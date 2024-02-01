import { ActorLogicFrom, assign, setup } from "xstate";
import { bind } from "@react-rxjs/core";

import { Meal } from "@/data/meals";
import { useGlobalActors } from "@/globalState";
import { fromCurrentRestaurantActor } from "./restaurant.machine";
import { toChildActor } from "../observables/utils";
import { BranchDirectorActor } from "./branchDirector.machine";

type FrontOfHouseMachineContext = {
  menu: Meal[];
};

type AddMealToMenuEvent = { type: "ADD_MEAL_TO_MENU"; meal: Meal };
type RemoveMealFromMenuEvent = { type: "REMOVE_MEAL_FROM_MENU"; meal: Meal };
type PrepareEvent = { type: "PREPARE" };
type ReadyEvent = { type: "READY" };
type CloseEvent = { type: "CLOSE" };
type FrontOfHouseMachineEvent =
  | AddMealToMenuEvent
  | RemoveMealFromMenuEvent
  | PrepareEvent
  | ReadyEvent
  | CloseEvent;

const frontOfHouseMachine = setup({
  types: {} as {
    context: FrontOfHouseMachineContext;
    events: FrontOfHouseMachineEvent;
  },
  actions: {
    updateMenu: assign(({ context: { menu } }, params: { meal: Meal }) => {
      const existingMealIndex = menu.findIndex((m) => m.id === params.meal.id);
      if (existingMealIndex !== -1) {
        return {
          menu: menu
            .slice(0, existingMealIndex)
            .concat(menu.slice(existingMealIndex + 1)),
        };
      }

      return {
        menu: menu.concat(params.meal),
      };
    }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QDMBOB7AdgFwPLIAl0BXWMAOgEsIAbMAYgAUAlAUUYEE2BtABgF1EoAA7pYlbJSxCQAD0QBWAEwB2cgBYAjOt4A2JQoA0IAJ6JNu3eSUBmAJwK7ADkdLNS204C+X42ix4hCRk5MKoYMIAhqiUmFD0bBwAIgCafIJIIKLiktKZ8gg2mgrkKpq8djYqRqaISk5Wzg7Oru5K6j5+GDj4RKQUYRHRsfHJSQD6ALKsHAAy4wAquFOsAHIAquky2RJSmDIFKrzkvE5KvEUGxmYImipqDkU6Bk4qTnZ6nSD+PUH95JEAMaSABuDAAwrNcABlVhbTI7XL7fKKVQabR6K61BD1RrvRwuOxuDwdXzfbqBPohQZRGJxBKsSa4ABqrBWc3GADFmLhJisNvCRGJdnlQAV1EprognJpyApeArii83h9dD4yZh0BA4DIfpTgmBtsKkQdEABaXRShAWr563oGqi0Q0I417U0IXQKNSaO6aV41G71WWqpSe5XvT5ku1-anhWkjI05N0o24WUo2dRVAN1FR2DSYsMKV4RtVRin2-5A0HOoVJ0VyRASvOhhT6bM414afEtIltUk+IA */
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
            type: "updateMenu",
            params: ({ event }) => ({ meal: event.meal }),
          },
        },

        REMOVE_MEAL_FROM_MENU: {
          target: "preparing",
          actions: {
            type: "updateMenu",
            params: ({ event }) => ({ meal: event.meal }),
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
