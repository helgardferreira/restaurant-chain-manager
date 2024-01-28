import { useSelector } from "@xstate/react";

import { useGlobalActors } from "@/globalState";
import { Button, ScrollArea } from ".";

export default function MealView() {
  const { restaurantActor } = useGlobalActors();
  const meal = useSelector(
    restaurantActor,
    ({ context }) => context.currentMealView
  );

  if (!meal) return null;

  return (
    <ScrollArea blockDisplay>
      <div className="grid self-start h-full grid-cols-[1fr,9rem] mx-auto gap-x-8">
        <div className="max-w-lg">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{meal.name}</h1>
          </div>

          <section aria-labelledby="information-heading" className="mt-4">
            <h2 id="information-heading" className="sr-only">
              Product information
            </h2>

            <div className="mt-4 space-y-6">
              <p className="text-sm">{meal.description}</p>
            </div>

            <div className="flex flex-col mt-6">
              <h3 className="text-sm">Ingredients:</h3>
              <p className="text-xs text-muted-foreground">
                {meal.ingredients.map(({ name }) => name).join(", ")}
              </p>
            </div>
          </section>
        </div>

        <div className="flex flex-col col-start-2 space-y-3 w-36">
          <div className="overflow-hidden rounded-lg aspect-h-1 aspect-w-1">
            <img
              src={meal.imageSrc}
              alt={meal.description}
              className="object-cover object-center w-full h-full"
            />
          </div>
          <Button>Add to menu</Button>
        </div>
      </div>
    </ScrollArea>
  );
}
