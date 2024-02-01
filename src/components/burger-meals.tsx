import { useCallback, useMemo } from "react";
import { useSelector } from "@xstate/react";
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
import { cn, nameToInitials } from "@/lib/utils";
import { useCurrentRestaurantActor } from "@/lib/actors/restaurant.machine";
import { useCurrentFrontOfHouseActor } from "@/lib/actors/frontOfHouse.machine";

type BurgerMealProps = {
  meal: Meal;
  currentMealView: Meal | undefined;
  currentMenu: Meal[];
};

function BurgerMeal(props: BurgerMealProps) {
  const { currentMealView, currentMenu, meal } = props;
  const { imageSrc, name, ingredients } = meal;

  const restaurantActor = useCurrentRestaurantActor();

  const mealIsActive = useMemo(
    () => currentMealView?.id === meal.id,
    [currentMealView?.id, meal.id]
  );
  const mealIsInMenu = useMemo(
    () => currentMenu.some(({ id }) => id === meal.id),
    [currentMenu, meal.id]
  );

  const addOrRemoveMeal = useCallback(() => {
    if (mealIsInMenu) {
      restaurantActor.send({
        type: "REMOVE_MEAL_FROM_MENU",
        meal,
      });
    } else {
      restaurantActor.send({
        type: "ADD_MEAL_TO_MENU",
        meal,
      });
    }
  }, [mealIsInMenu, restaurantActor, meal]);
  const toggleViewMeal = useCallback(() => {
    if (mealIsActive) {
      restaurantActor.send({
        type: "CLEAR_MEAL",
      });
    } else {
      restaurantActor.send({
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
              "px-2",
              !currentMealView && "py-1",
              "overflow-hidden",
              currentMealView ? "rounded" : "rounded-md",
              "grow",
              "select-none",
              "hover:bg-accent",
              mealIsActive && "bg-accent",
              "cursor-pointer",
              "ring-offset-background",
              "focus-visible:outline-none",
              "focus-visible:ring-2",
              "focus-visible:ring-ring",
              "focus-visible:ring-offset-2",
              "transition-[padding,border-radius]",
              "relative",
              mealIsInMenu ? "before:content-['']" : "before:content-none",
              "before:absolute",
              "before:w-1",
              "before:h-full",
              "before:left-0",
              "before:top-1/2",
              "before:-translate-y-1/2",
              "before:bg-green-500",
              "before:rounded-md"
            )}
            onClick={toggleViewMeal}
            onKeyUp={handleMealSelect}
          >
            <Avatar
              className={cn(
                currentMealView ? "h-6 w-6" : "h-9 w-9",
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
                currentMealView ? "space-y-0" : "space-y-1",
                "overflow-hidden"
              )}
            >
              <p
                className={cn(
                  "font-medium",
                  "leading-none",
                  !currentMealView && "text-sm",
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
                  currentMealView ? "h-0" : "h-4",
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
          <ContextMenuItem onSelect={addOrRemoveMeal}>
            {mealIsInMenu ? "Remove meal" : "Add meal"}
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "flex",
              currentMealView ? "h-6 w-6" : "h-8 w-8",
              currentMealView ? "rounded" : "rounded-md",
              "mx-2",
              !currentMealView && "my-1",
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
          <DropdownMenuItem onSelect={addOrRemoveMeal}>
            {mealIsInMenu ? "Remove meal" : "Add meal"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function BurgerMeals() {
  const restaurantActor = useCurrentRestaurantActor();
  const frontOfHouseActor = useCurrentFrontOfHouseActor();

  const currentMenu = useSelector(
    frontOfHouseActor,
    ({ context }) => context.menu
  );
  const currentMealView = useSelector(
    restaurantActor,
    ({ context }) => context.currentMealView
  );

  return (
    <ScrollArea blockDisplay>
      <div className={cn("py-1", currentMealView ? "space-y-1" : "space-y-2")}>
        {meals.map((meal) => (
          <BurgerMeal
            currentMealView={currentMealView}
            currentMenu={currentMenu}
            key={meal.id}
            meal={meal}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
