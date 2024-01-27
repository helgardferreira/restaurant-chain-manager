import { Avatar, AvatarImage, AvatarFallback } from ".";

import { dailySpecials } from "@/data/dailySpecials";
import type { DailySpecial } from "@/data/dailySpecials";

type DailySpecialProps = {
  dailySpecial: DailySpecial;
};

function DailySpecial(props: DailySpecialProps) {
  const {
    dailySpecial: { imageSrc, name, day, description },
  } = props;

  return (
    <div className="flex items-center">
      <Avatar className="h-9 w-9">
        <AvatarImage src={imageSrc} alt="Avatar" />
        <AvatarFallback>OM</AvatarFallback>
      </Avatar>
      <div className="ml-4 space-y-1">
        <p className="text-sm font-medium leading-none">{name}</p>
        <p className="text-sm truncate text-muted-foreground max-w-72">
          {description}
        </p>
      </div>
      <div className="self-start ml-auto">{day}</div>
    </div>
  );
}

const dayOrder = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 7,
};

export function DailySpecials() {
  return (
    <div className="space-y-8 h-[25rem] overflow-y-auto">
      {dailySpecials
        .sort((a, b) => dayOrder[a.day] - dayOrder[b.day])
        .map((dailySpecial) => (
          <DailySpecial key={dailySpecial.id} dailySpecial={dailySpecial} />
        ))}
    </div>
  );
}
