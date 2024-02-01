import { useCallback, useMemo } from "react";
import { useSelector } from "@xstate/react";
import { differenceBy } from "lodash";

import { Button, ScrollArea } from ".";

import { useCurrentRestaurantActor } from "@/lib/actors/restaurant.machine";
import { useCurrentFrontOfHouseActor } from "@/lib/actors/frontOfHouse.machine";

export default function MealView() {
  const restaurantActor = useCurrentRestaurantActor();
  const frontOfHouseActor = useCurrentFrontOfHouseActor();

  const selectedMeals = useSelector(
    restaurantActor,
    ({ context }) => context.selectedMeals
  );
  const lastSelectedMeal = useMemo(() => selectedMeals.at(-1), [selectedMeals]);

  const currentMenu = useSelector(
    frontOfHouseActor,
    ({ context }) => context.menu
  );

  const canRemoveMultiple = useMemo(() => {
    return (
      selectedMeals.length > 1 &&
      differenceBy(selectedMeals, currentMenu, "id").length === 0
    );
  }, [currentMenu, selectedMeals]);

  const mealIsInMenu = useMemo(
    () => currentMenu.some(({ id }) => id === lastSelectedMeal?.id),
    [currentMenu, lastSelectedMeal?.id]
  );

  const addOrRemoveMeal = useCallback(() => {
    if (!lastSelectedMeal) return;

    if (selectedMeals.length === 1) {
      if (mealIsInMenu) {
        restaurantActor.send({
          type: "REMOVE_MEAL_FROM_MENU",
          meal: lastSelectedMeal,
        });
      } else {
        restaurantActor.send({
          type: "ADD_MEAL_TO_MENU",
          meal: lastSelectedMeal,
        });
      }
    } else if (canRemoveMultiple) {
      restaurantActor.send({ type: "REMOVE_MEALS_FROM_MENU" });
    } else {
      restaurantActor.send({ type: "ADD_MEALS_TO_MENU" });
    }
  }, [
    canRemoveMultiple,
    lastSelectedMeal,
    mealIsInMenu,
    restaurantActor,
    selectedMeals.length,
  ]);

  if (!lastSelectedMeal) return null;

  return (
    <ScrollArea blockDisplay>
      <div className="grid self-start h-full grid-cols-[1fr,9rem] mx-auto gap-x-8 px-1">
        <div className="max-w-lg">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {lastSelectedMeal.name}
            </h1>
          </div>

          <section aria-labelledby="information-heading" className="mt-4">
            <h2 id="information-heading" className="sr-only">
              Product information
            </h2>

            <div className="mt-4 space-y-6">
              <p className="text-sm">{lastSelectedMeal.description}</p>
            </div>

            <div className="flex flex-col mt-6">
              <h3 className="text-sm">Ingredients:</h3>
              <p className="text-xs text-muted-foreground">
                {lastSelectedMeal.ingredients
                  .map(({ name }) => name)
                  .join(", ")}
              </p>
            </div>
          </section>
        </div>

        <div className="flex flex-col col-start-2 space-y-3 w-36">
          <div className="overflow-hidden rounded-lg aspect-h-1 aspect-w-1">
            <img
              src={lastSelectedMeal.imageSrc}
              alt={lastSelectedMeal.description}
              className="object-cover object-center w-full h-full"
            />
          </div>
          <Button onClick={addOrRemoveMeal}>
            {selectedMeals.length === 0 && "Add meal"}
            {selectedMeals.length === 1 && !mealIsInMenu && "Add meal"}
            {selectedMeals.length === 1 && mealIsInMenu && "Remove meal"}
            {selectedMeals.length > 1 && !canRemoveMultiple && "Add meals"}
            {selectedMeals.length > 1 && canRemoveMultiple && "Remove meals"}
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}
