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
} from ".";

import { type BurgerSpecial, burgerSpecials } from "@/data/burgerSpecials";
import { useGlobalActors } from "@/globalState";
import { cn } from "@/lib/utils";

type BurgerSpecialProps = {
  special: BurgerSpecial;
};

function Special(props: BurgerSpecialProps) {
  const { special } = props;
  const { imageSrc, name, ingredients } = special;

  const { restaurantActor } = useGlobalActors();
  const setDailySpecial = useCallback(() => {
    restaurantActor.send({
      type: "SET_DAILY_SPECIAL",
      special,
    });
  }, [restaurantActor, special]);
  const viewSpecial = useCallback(() => {
    restaurantActor.send({
      type: "VIEW_SPECIAL",
      special,
    });
  }, [restaurantActor, special]);
  const handleSpecialSelect = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        viewSpecial();
      }
    },
    [viewSpecial]
  );

  return (
    <div className="relative flex items-center justify-between">
      <div
        role="button"
        tabIndex={0}
        aria-label="Open special menu"
        className={cn(
          "flex",
          "items-center",
          "m-1",
          "p-1",
          "overflow-hidden",
          "rounded-md",
          "grow",
          "select-none",
          "hover:bg-accent",
          "cursor-pointer",
          "ring-offset-background",
          "focus-visible:outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-ring",
          "focus-visible:ring-offset-2"
        )}
        onClick={viewSpecial}
        onKeyUp={handleSpecialSelect}
      >
        <Avatar className="h-9 w-9">
          <AvatarImage src={imageSrc} alt="Avatar" />
          <AvatarFallback>OM</AvatarFallback>
        </Avatar>
        <div className="w-full ml-4 space-y-1 overflow-hidden">
          <p className="text-sm font-medium leading-none">{name}</p>
          <p className="text-sm truncate text-muted-foreground">
            {ingredients.map(({ name }) => name).join(", ")}
          </p>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-accent shrink-0 m-2"
          >
            <DotsHorizontalIcon className="w-4 h-4" />
            <span className="sr-only">Open special menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem>View stock</DropdownMenuItem>
          <DropdownMenuItem onSelect={setDailySpecial}>
            Set daily special
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function BurgerSpecials() {
  return (
    <ScrollArea className="h-[25rem]" blockDisplay>
      <div>
        {burgerSpecials.map((special) => (
          <Special key={special.id} special={special} />
        ))}
      </div>
    </ScrollArea>
  );
}
