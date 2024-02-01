import { setup, sendTo, assign, Actor, ActorLogicFrom } from "xstate";
import { bind } from "@react-rxjs/core";

import { Meal } from "@/data/meals";
import { useGlobalActors } from "@/globalState";

import { kitchenMachine } from "./kitchen.machine";
import { frontOfHouseMachine } from "./frontOfHouse.machine";
import {
  BranchDirectorActor,
  BranchDirectorLogic,
} from "./branchDirector.machine";
import { fromChildActor } from "../observables/utils";

type RestaurantContext = {
  menu: Meal[];
  currentMealView: Meal | undefined;
  branchId: string;
};

type AddMealToMenuEvent = { type: "ADD_MEAL_TO_MENU"; meal: Meal };
type RemoveMealFromMenuEvent = { type: "REMOVE_MEAL_FROM_MENU"; meal: Meal };
type ViewMealEvent = { type: "VIEW_MEAL"; meal: Meal };
type ClearMealEvent = { type: "CLEAR_MEAL" };
type OpenEvent = { type: "OPEN" };
type LastCallEvent = { type: "LAST_CALL" };
type CloseEvent = { type: "CLOSE" };
type ResetEvent = { type: "RESET" };
type PrepareEvent = { type: "PREPARE" };

type RestaurantEvent =
  | AddMealToMenuEvent
  | RemoveMealFromMenuEvent
  | ViewMealEvent
  | ClearMealEvent
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
    removeFromFrontOfHouseMenu: sendTo(
      "frontOfHouse",
      (_, params: { meal: Meal }) => ({
        type: "REMOVE_MEAL_FROM_MENU",
        meal: params.meal,
      })
    ),
    addToFrontOfHouseMenu: sendTo(
      "frontOfHouse",
      (_, params: { meal: Meal }) => ({
        type: "ADD_MEAL_TO_MENU",
        meal: params.meal,
      })
    ),
    setCurrentMealView: assign((_, params: { meal: Meal }) => ({
      currentMealView: params.meal,
    })),
    clearCurrentMealView: assign(() => ({
      currentMealView: undefined,
    })),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QCc4BcCGBXZGB2aAdAA6rEbICWeUAxAIIAijA+gLICi9AMiwCoB5dhwByAVQDaABgC6iUMQD2sSmkqK88kAA9EANj2EArAGYjARj3mAHLakmALNb0AaEAE9EDhycLWjAJwmAVIWAEwA7HphAQC+sW6osJg4+ESkYORUNLQAagCSHADqwjzSckggSipqGlq6CNZhhFLmAaa2TdYBAdFungiOEYQOUtFR-jbORnrxiejYuAQkZBTUdADC3FwASqXc5VrVquqalQ1Rfj4RpnoB5ibWlv2IYUZShO0m5t6BJlZGMKzBIgJIpJbpVbZOgCAAKokOlWOtTOoAa3yMhAi5ikAR8Jm+YTerg8iCMgL87X8Thx3nMc1BC1SywyWXWtB2HDYAlyHH2LAAYjsBGxhOJEQplCc6ucvM0pArFUrFT8XghzEYHCMej0TBE9XiQhEGWDFmlCIpiGA8LRuPQAMp8FgbHgHWRHKUo+pknFY94Ktq47x9UkIcnNbpGalPKR0k1MiGEADGABspTlOfaOHwJVVPadvQgAtYtYDHMGbt4TGE1eHKVHNTG4yDTcz0so0Bs0yoaPQ8BAdnAwGhaLDObD6Jzc8iC7KiyXjGFyw49JWfDXQ+vCD8G84AkSwqF48kzcsUxhkhsMCmU7QtgIs9P8zK0YgopiV7j7HpHAYIrWKUjaNaQcekGTwRQIDgLRWwhD0alnV8EAAWkxHV0Iw4sSQGZDDGVfCAwcY9wXNVk1hoeDpVRHREHMSwsUcPUpAiaxq0CbxawcTFCXeUD9R-PFiNPIhLWtSivTnBxD0IMIbAiBwgg1YtQIA3xgijf5ZJMWMrCEttk27dZxMQmjGhY7c9FGPQpFY+4niMVTCHU1jogeHSwPmE99OqTtDN7ftB1gYdjJfUy6J+GSgXJBSInkn9OOGJ4wgcCIgliujIj0xNz0va8UxC6iGj0IxhmCEtvCiBVNUc5zNLclcwPiIA */
  id: "restaurant",

  context: ({ input: { branchId } }) => ({
    currentMealView: undefined,
    menu: [],
    branchId,
  }),

  initial: "preparing",

  states: {
    preparing: {
      on: {
        ADD_MEAL_TO_MENU: {
          target: "preparing",
          actions: {
            type: "addToFrontOfHouseMenu",
            params: ({ event }) => ({ meal: event.meal }),
          },
        },

        VIEW_MEAL: {
          target: "preparing",
          actions: {
            type: "setCurrentMealView",
            params: ({ event }) => ({ meal: event.meal }),
          },
        },

        CLEAR_MEAL: {
          target: "preparing",
          actions: "clearCurrentMealView",
        },

        OPEN: {
          target: "open",
          reenter: true,
        },

        REMOVE_MEAL_FROM_MENU: {
          target: "preparing",
          actions: {
            type: "removeFromFrontOfHouseMenu",
            params: ({ event }) => ({ meal: event.meal }),
          },
        },
      },
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
          reenter: true,
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
