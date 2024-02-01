import {
  from,
  Observable,
  map,
  mergeMap,
  combineLatestWith,
  switchMap,
  reduce,
} from "rxjs";
import { bind } from "@react-rxjs/core";

import { fromChildActor, toActorState } from "@/lib/observables/utils";
import {
  BranchDirectorActor,
  BranchDirectorLogic,
} from "@/lib/actors/branchDirector.machine";
import { RestaurantLogic } from "@/lib/actors/restaurant.machine";
import { Meal } from "@/data/meals";
import { fromCurrentKitchenActor } from "@/lib/actors/kitchen.machine";
import { fromCurrentFrontOfHouseActor } from "@/lib/actors/frontOfHouse.machine";

const toIngredients = (source: Observable<Meal>) =>
  source.pipe(
    map((meal) => meal.ingredients),
    mergeMap((ingredients) => ingredients),
    reduce(
      (acc, ingredient) => {
        if (Object.prototype.hasOwnProperty.call(acc, ingredient.id)) {
          acc[ingredient.id]++;
        } else {
          acc[ingredient.id] = 1;
        }
        return acc;
      },
      {} as Record<string, number>
    )
  );

const fromMenuIngredients = (branchDirectorActor: BranchDirectorActor) =>
  fromCurrentFrontOfHouseActor(branchDirectorActor).pipe(
    toActorState(({ context }) => context.menu),
    switchMap((menu) => from(menu).pipe(toIngredients))
  );

const fromKitchenStock = (branchDirectorActor: BranchDirectorActor) =>
  fromCurrentKitchenActor(branchDirectorActor).pipe(
    toActorState(({ context }) => context.stock)
  );

const [useStockData, fromStockData] = bind(
  (branchDirectorActor: BranchDirectorActor) =>
    fromChildActor<RestaurantLogic, BranchDirectorLogic>(
      branchDirectorActor,
      ({ context }) => context.currentRestaurantActor
    ).pipe(
      toActorState(({ context }) => context.currentMealView?.ingredients ?? []),
      combineLatestWith(
        fromMenuIngredients(branchDirectorActor),
        fromKitchenStock(branchDirectorActor)
      ),
      map(([currentIngredients, inMenuIngredients, stockData]) =>
        stockData.map((ingredient) => {
          const newIngredient = structuredClone(ingredient);

          if (currentIngredients.some((i) => i.id === ingredient.id)) {
            newIngredient.current = 1;
            newIngredient.excess -= 1;
          }

          const inMenuIngredientCount = inMenuIngredients[ingredient.id];
          if (inMenuIngredientCount !== undefined) {
            newIngredient.inMenu = inMenuIngredientCount;
            newIngredient.excess -= inMenuIngredientCount;
          }

          return newIngredient;
        })
      )
    )
);

export { useStockData, fromStockData };
