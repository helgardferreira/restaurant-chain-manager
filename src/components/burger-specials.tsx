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
import { useCallback } from "react";

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

  return (
    <div className="relative flex items-center justify-between p-1">
      <div className="flex items-center overflow-hidden">
        <Avatar className="h-9 w-9">
          <AvatarImage src={imageSrc} alt="Avatar" />
          <AvatarFallback>OM</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1 overflow-hidden">
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
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted shrink-0 ml-4"
          >
            <DotsHorizontalIcon className="w-4 h-4" />
            <span className="sr-only">Open special menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
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
      <div className="space-y-8">
        {burgerSpecials.map((special) => (
          <Special key={special.id} special={special} />
        ))}
      </div>
    </ScrollArea>
  );
}
