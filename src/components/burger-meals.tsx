import { useCallback, useEffect, useMemo } from "react";
import { fromObservable } from "xstate";
import { useActor } from "@xstate/react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  ScrollArea,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from ".";

import { type Meal, meals } from "@/data/meals";
import { useGlobalActors } from "@/globalState";
import { cn, nameToInitials } from "@/lib/utils";
import {
  fromCurrentRestaurantActor,
  toActorState,
  toChildActor,
} from "@/lib/observables/utils";
import { BranchDirectorActor } from "@/lib/actors/branchDirector.machine";
import { KitchenLogic } from "@/lib/actors/kitchen.machine";

const restaurantRefLogic = fromObservable(
  ({
    input: { branchDirectorActor },
  }: {
    input: { branchDirectorActor: BranchDirectorActor };
  }) => fromCurrentRestaurantActor(branchDirectorActor)
);
const currentMealViewLogic = fromObservable(
  ({
    input: { branchDirectorActor },
  }: {
    input: { branchDirectorActor: BranchDirectorActor };
  }) =>
    fromCurrentRestaurantActor(branchDirectorActor).pipe(
      toActorState(({ context }) => context.currentMealView)
    )
);

type BurgerMealProps = {
  meal: Meal;
  minimized?: boolean;
};

function BurgerMeal(props: BurgerMealProps) {
  const { meal, minimized = false } = props;
  const { imageSrc, name, ingredients } = meal;

  // TODO: create custom hooks
  const { branchDirectorActor } = useGlobalActors();
  const [{ context: restaurantActor }] = useActor(restaurantRefLogic, {
    input: { branchDirectorActor },
  });
  const [{ context: currentMealView }] = useActor(currentMealViewLogic, {
    input: { branchDirectorActor },
  });

  const mealIsActive = useMemo(
    () => currentMealView?.id === meal.id,
    [currentMealView?.id, meal.id]
  );
  const addMealToMenu = useCallback(() => {
    restaurantActor?.send({
      type: "ADD_MEAL",
      meal,
    });
  }, [restaurantActor, meal]);
  const toggleViewMeal = useCallback(() => {
    if (mealIsActive) {
      restaurantActor?.send({
        type: "CLEAR_MEAL",
      });
    } else {
      restaurantActor?.send({
        type: "VIEW_MEAL",
        meal,
      });
    }
  }, [mealIsActive, meal, restaurantActor]);
  const handleMealSelect = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        toggleViewMeal();
      }
    },
    [toggleViewMeal]
  );

  return (
    <div className="relative flex items-center justify-between transition-[margin]">
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            role="button"
            tabIndex={0}
            aria-label="Open meal menu"
            className={cn(
              "flex",
              "items-center",
              "mx-1",
              "px-1",
              !minimized && "py-1",
              "overflow-hidden",
              minimized ? "rounded" : "rounded-md",
              "grow",
              "select-none",
              "hover:bg-accent",
              currentMealView?.id === meal.id && "bg-accent",
              "cursor-pointer",
              "ring-offset-background",
              "focus-visible:outline-none",
              "focus-visible:ring-2",
              "focus-visible:ring-ring",
              "focus-visible:ring-offset-2",
              "transition-[padding,border-radius]"
            )}
            onClick={toggleViewMeal}
            onKeyUp={handleMealSelect}
          >
            <Avatar
              className={cn(
                minimized ? "h-6 w-6" : "h-9 w-9",
                "transition-[height,width]"
              )}
            >
              <AvatarImage src={imageSrc} alt="Avatar" />
              <AvatarFallback>{nameToInitials(name)}</AvatarFallback>
            </Avatar>
            <div
              className={cn(
                "w-full",
                "ml-4",
                minimized ? "space-y-0" : "space-y-1",
                "overflow-hidden"
              )}
            >
              <p
                className={cn(
                  "font-medium",
                  "leading-none",
                  !minimized && "text-sm",
                  "transition-[font-size,margin]"
                )}
              >
                {name}
              </p>
              <p
                className={cn(
                  "text-sm",
                  "truncate",
                  "text-muted-foreground",
                  "leading-none",
                  minimized ? "h-0" : "h-4",
                  "transition-[height,margin]"
                )}
              >
                {ingredients.map(({ name }) => name).join(", ")}
              </p>
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onSelect={toggleViewMeal}>
            {mealIsActive ? "Close meal" : "View meal"}
          </ContextMenuItem>
          <ContextMenuItem onSelect={addMealToMenu}>
            Add meal to menu
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "flex",
              minimized ? "h-6 w-6" : "h-8 w-8",
              minimized ? "rounded" : "rounded-md",
              "mx-2",
              !minimized && "my-1",
              "p-0",
              "data-[state=open]:bg-accent",
              "shrink-0",
              "transition-[height,width,border-radius,margin]"
            )}
          >
            <DotsHorizontalIcon className="w-4 h-4" />
            <span className="sr-only">Open meal menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onSelect={toggleViewMeal}>
            {mealIsActive ? "Close meal" : "View meal"}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={addMealToMenu}>
            Add meal to menu
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

const mealIsSelectedLogic = fromObservable(
  ({
    input: { branchDirectorActor },
  }: {
    input: { branchDirectorActor: BranchDirectorActor };
  }) =>
    fromCurrentRestaurantActor(branchDirectorActor).pipe(
      toActorState(({ context }) => !!context.currentMealView)
    )
);

export function BurgerMeals() {
  const { branchDirectorActor } = useGlobalActors();

  useEffect(() => {
    const sub = fromCurrentRestaurantActor(branchDirectorActor)
      .pipe(
        toChildActor<KitchenLogic>("kitchen"),
        toActorState(({ context }) => context.stock)
      )
      .subscribe((stock) => {
        console.log("kitchen stock", { stock });
      });

    return () => sub.unsubscribe();
  }, [branchDirectorActor]);

  // TODO: create custom hook for child actor, selectors, etc.
  const [{ context: mealIsSelected }] = useActor(mealIsSelectedLogic, {
    input: { branchDirectorActor },
  });

  return (
    <ScrollArea blockDisplay>
      <div className={cn("py-1", mealIsSelected ? "space-y-1" : "space-y-2")}>
        {meals.map((meal) => (
          <BurgerMeal minimized={mealIsSelected} key={meal.id} meal={meal} />
        ))}
      </div>
    </ScrollArea>
  );
}
