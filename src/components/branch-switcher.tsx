import { useState } from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
} from "@/components";
import { restaurantBranches } from "@/data/restaurantBranches";
import { cn } from "@/lib/utils";

import mascotImgUrl from "@/assets/grill-giggle-joint-mascot.png";
import { useGlobalActors } from "@/globalState";
import { useSelector } from "@xstate/react";
import { useNavigate } from "@tanstack/react-router";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface BranchSwitcherProps extends PopoverTriggerProps {}

export default function BranchSwitcher({ className }: BranchSwitcherProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { branchActor } = useGlobalActors();
  const currentBranch = useSelector(
    branchActor,
    ({ context }) => context.currentBranch
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a branch"
          className={cn("w-[200px] justify-between", className)}
        >
          {currentBranch && (
            <>
              <Avatar className="w-5 h-5 mr-2">
                <AvatarImage src={mascotImgUrl} alt={currentBranch.alias} />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <span className="leading-none truncate">
                {currentBranch.alias}
              </span>
            </>
          )}
          {!currentBranch && (
            <>
              <Skeleton className="w-5 h-5 mr-2 rounded-full shrink-0" />
              <Skeleton className="w-full h-4" />
            </>
          )}

          <CaretSortIcon className="w-4 h-4 ml-auto opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search branch..." />
            <CommandEmpty>No branch found.</CommandEmpty>
            {restaurantBranches.map((branch) => (
              <CommandGroup
                key={crypto.randomUUID()}
                heading={`${branch.state} - ${branch.location}`}
              >
                <CommandItem
                  key={branch.id}
                  onSelect={() => {
                    setOpen(false);
                    navigate({
                      to: "/",
                      search: {
                        branch: branch.id,
                      },
                    });
                  }}
                  className="text-sm"
                >
                  <Avatar className="w-5 h-5 mr-2">
                    <AvatarImage src={mascotImgUrl} alt={branch.alias} />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <span className="truncate">{branch.alias}</span>
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentBranch?.id === branch.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              </CommandGroup>
            ))}
          </CommandList>
          <CommandSeparator />
        </Command>
      </PopoverContent>
    </Popover>
  );
}
