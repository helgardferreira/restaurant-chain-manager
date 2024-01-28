import { useCallback } from "react";
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
import { cn } from "@/lib/utils";
import { useSelector } from "@xstate/react";

function nameToInitials(name: string): string {
  const words = name.split(" ");
  const initials = words
    .filter((word) => word.toLowerCase() !== "the")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
  return initials;
}

type BurgerMealProps = {
  meal: Meal;
  minimized?: boolean;
};

function BurgerMeal(props: BurgerMealProps) {
  const { meal, minimized = false } = props;
  const { imageSrc, name, ingredients } = meal;

  const { restaurantActor } = useGlobalActors();
  const currentMealView = useSelector(
    restaurantActor,
    ({ context }) => context.currentMealView
  );
  const setDailySpecial = useCallback(() => {
    restaurantActor.send({
      type: "SET_DAILY_SPECIAL",
      meal,
    });
  }, [restaurantActor, meal]);
  const viewMeal = useCallback(() => {
    if (currentMealView?.id === meal.id) {
      restaurantActor.send({
        type: "CLEAR_MEAL",
      });
    } else {
      restaurantActor.send({
        type: "VIEW_MEAL",
        meal,
      });
    }
  }, [currentMealView?.id, meal, restaurantActor]);
  const handleMealSelect = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        viewMeal();
      }
    },
    [viewMeal]
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
              "cursor-pointer",
              "ring-offset-background",
              "focus-visible:outline-none",
              "focus-visible:ring-2",
              "focus-visible:ring-ring",
              "focus-visible:ring-offset-2",
              "transition-[padding,border-radius]"
            )}
            onClick={viewMeal}
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
          <ContextMenuItem onSelect={viewMeal}>View stock</ContextMenuItem>
          <ContextMenuItem onSelect={setDailySpecial}>
            Set daily special
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
          <DropdownMenuItem onSelect={viewMeal}>View stock</DropdownMenuItem>
          <DropdownMenuItem onSelect={setDailySpecial}>
            Set daily special
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function BurgerMeals() {
  const { restaurantActor } = useGlobalActors();
  const mealIsSelected = useSelector(
    restaurantActor,
    ({ context }) => !!context.currentMealView
  );

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