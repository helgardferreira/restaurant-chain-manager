import { useCallback, useMemo } from "react";
import { useSelector } from "@xstate/react";

import { Button, ScrollArea } from ".";

import { useCurrentRestaurantActor } from "@/lib/actors/restaurant.machine";
import { useCurrentFrontOfHouseActor } from "@/lib/actors/frontOfHouse.machine";

export default function MealView() {
  const restaurantActor = useCurrentRestaurantActor();
  const frontOfHouseActor = useCurrentFrontOfHouseActor();

  const currentMealView = useSelector(
    restaurantActor,
    ({ context }) => context.currentMealView
  );
  const currentMenu = useSelector(
    frontOfHouseActor,
    ({ context }) => context.menu
  );

  const mealIsInMenu = useMemo(
    () => currentMenu.some(({ id }) => id === currentMealView?.id),
    [currentMealView, currentMenu]
  );

  const addOrRemoveMeal = useCallback(() => {
    if (!currentMealView) return;

    if (mealIsInMenu) {
      restaurantActor.send({
        type: "REMOVE_MEAL_FROM_MENU",
        meal: currentMealView,
      });
    } else {
      restaurantActor.send({
        type: "ADD_MEAL_TO_MENU",
        meal: currentMealView,
      });
    }
  }, [mealIsInMenu, restaurantActor, currentMealView]);

  if (!currentMealView) return null;

  return (
    <ScrollArea blockDisplay>
      <div className="grid self-start h-full grid-cols-[1fr,9rem] mx-auto gap-x-8">
        <div className="max-w-lg">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {currentMealView.name}
            </h1>
          </div>

          <section aria-labelledby="information-heading" className="mt-4">
            <h2 id="information-heading" className="sr-only">
              Product information
            </h2>

            <div className="mt-4 space-y-6">
              <p className="text-sm">{currentMealView.description}</p>
            </div>

            <div className="flex flex-col mt-6">
              <h3 className="text-sm">Ingredients:</h3>
              <p className="text-xs text-muted-foreground">
                {currentMealView.ingredients.map(({ name }) => name).join(", ")}
              </p>
            </div>
          </section>
        </div>

        <div className="flex flex-col col-start-2 space-y-3 w-36">
          <div className="overflow-hidden rounded-lg aspect-h-1 aspect-w-1">
            <img
              src={currentMealView.imageSrc}
              alt={currentMealView.description}
              className="object-cover object-center w-full h-full"
            />
          </div>
          <Button onClick={addOrRemoveMeal}>
            {mealIsInMenu ? "Remove meal" : "Add meal"}
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}
