import { useCallback, useState } from "react";
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
} from "@/components";
import {
  type RestaurantBranch,
  restaurantBranches,
} from "@/data/restaurantBranches";
import { cn } from "@/lib/utils";

import mascotImgUrl from "@/assets/grill-giggle-joint-mascot.png";
import { useGlobalActors } from "@/globalState";
import { useSelector } from "@xstate/react";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface BranchSwitcherProps extends PopoverTriggerProps {}

export default function BranchSwitcher({ className }: BranchSwitcherProps) {
  const { branchActor } = useGlobalActors();
  const selectedBranch = useSelector(branchActor, ({ context }) => context);
  const setSelectedBranch = useCallback(
    (branch: RestaurantBranch) => {
      branchActor.send({ type: "SELECT_BRANCH", branch });
    },
    [branchActor]
  );

  const [open, setOpen] = useState(false);

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
          <Avatar className="w-5 h-5 mr-2">
            <AvatarImage src={mascotImgUrl} alt={selectedBranch.alias} />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          <span className="truncate">{selectedBranch.alias}</span>
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
                    setSelectedBranch(branch);
                    setOpen(false);
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
                      selectedBranch.id === branch.id
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
