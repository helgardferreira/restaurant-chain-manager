import { fromObservable } from "xstate";
import {
  from,
  filter,
  Observable,
  map,
  mergeMap,
  distinct,
  toArray,
  distinctUntilChanged,
  switchMap,
  combineLatestWith,
  bufferCount,
} from "rxjs";

import { fromIndexSearch } from "@/lib/observables/router";
import {
  fromChildActor,
  toActorState,
  toRunningArray,
} from "@/lib/observables/utils";
import { randomWithSeed, hashStringToNumber } from "@/lib/utils";
import { IngredientStock } from "@/lib/types";
import {
  BranchDirectorActor,
  BranchDirectorLogic,
} from "@/lib/actors/branchDirector.machine";
import { RestaurantLogic } from "@/lib/actors/restaurant.machine";
import { Meal, meals, Ingredient, ingredients } from "@/data/meals";

const fromRandomMeals = (meals: Meal[]) =>
  from(meals).pipe(filter(() => Math.random() > 0.8));

const toIngredients = (source: Observable<Meal>) =>
  source.pipe(
    map((meal) => meal.ingredients),
    mergeMap((ingredients) => ingredients),
    distinct(({ id }) => id)
  );

const toRandomIngredientStock =
  (seed: number) =>
  (source: Observable<Ingredient>): Observable<IngredientStock> =>
    source.pipe(
      map((ingredient, i) => ({
        ...ingredient,
        // excess: Math.floor(Math.random() * 10 + 2),
        excess: randomWithSeed(seed + i, 4, 20),
        current: 0,
        inMenu: 0,
      }))
    );

const fromRandomInMenuIngredients = () =>
  fromRandomMeals(meals).pipe(toIngredients, toArray());

const fromRandomIngredientsStock = () =>
  fromIndexSearch().pipe(
    map((search) => search.branchId ?? "the-magic-city-grill"),
    distinctUntilChanged(),
    switchMap((branch) =>
      from(ingredients).pipe(
        toRandomIngredientStock(hashStringToNumber(branch))
      )
    ),
    toRunningArray((a, b) => a.id === b.id),
    bufferCount(ingredients.length),
    map((stock) => stock.at(-1) ?? [])
  );

const fromStockData = (branchDirectorActor: BranchDirectorActor) =>
  fromChildActor<RestaurantLogic, BranchDirectorLogic>(
    branchDirectorActor,
    ({ context }) => context.currentRestaurantActor
  ).pipe(
    toActorState(({ context }) => context.currentMealView?.ingredients ?? []),
    combineLatestWith(
      // TODO: replace with data from state machine and not random data
      fromRandomInMenuIngredients(),
      // TODO: replace with data from state machine and not random data
      fromRandomIngredientsStock()
    ),
    map(([currentIngredients, inMenuIngredients, stockData]) =>
      stockData.map((ingredient) => {
        const newIngredient = structuredClone(ingredient);

        if (currentIngredients.some((i) => i.id === ingredient.id)) {
          newIngredient.current = 1;
          newIngredient.excess -= 1;
        }

        if (inMenuIngredients.some((i) => i.id === ingredient.id)) {
          newIngredient.inMenu = 1;
          newIngredient.excess -= 1;
        }

        return newIngredient;
      })
    )
  );

// TODO: might be ways to make this more performant (there might be unnecessary iteration)
const dataLogic = fromObservable<
  IngredientStock[],
  { branchDirectorActor: BranchDirectorActor }
>(({ input: { branchDirectorActor } }) => fromStockData(branchDirectorActor));

export { dataLogic };
