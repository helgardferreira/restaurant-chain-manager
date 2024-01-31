import { fromObservable } from "xstate";
import { useActor } from "@xstate/react";

import { Button, ScrollArea } from ".";

import { useGlobalActors } from "@/globalState";
import {
  BranchDirectorActor,
  BranchDirectorLogic,
} from "@/lib/actors/branchDirector.machine";
import { fromChildActor, toActorState } from "@/lib/observables/utils";
import { RestaurantLogic } from "@/lib/actors/restaurant.machine";

const currentMealViewLogic = fromObservable(
  ({
    input: { branchDirectorActor },
  }: {
    input: { branchDirectorActor: BranchDirectorActor };
  }) =>
    fromChildActor<RestaurantLogic, BranchDirectorLogic>(
      branchDirectorActor,
      ({ context }) => context.currentRestaurantActor
    ).pipe(toActorState(({ context }) => context.currentMealView))
);

export default function MealView() {
  const { branchDirectorActor } = useGlobalActors();
  const [{ context: currentMealView }] = useActor(currentMealViewLogic, {
    input: { branchDirectorActor },
  });

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
          <Button>Add to menu</Button>
        </div>
      </div>
    </ScrollArea>
  );
}
