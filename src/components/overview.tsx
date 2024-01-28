import {
  Bar,
  BarChart,
  Label,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";

import { Ingredient, ingredients } from "@/data/burgerSpecials";
import { useTheme } from "@/lib/hooks/useTheme";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

type IngredientStock = Ingredient & {
  total: number;
};

const data: IngredientStock[] = ingredients.map((ingredient) => ({
  ...ingredient,
  total: Math.floor(Math.random() * 5000) + 1000,
}));

type TooltipItem = IngredientStock & {
  dataKey: string;
};

type ChartTooltipProps = TooltipProps<number, string> & {
  className?: string;
};

function ChartTooltip(props: ChartTooltipProps) {
  const { payload } = props;
  const item = useMemo(
    (): TooltipItem | undefined =>
      payload && payload[0]
        ? {
            ...payload[0].payload,
            dataKey: payload[0].dataKey,
          }
        : undefined,
    [payload]
  );

  return (
    <div
      className={cn(
        "z-50",
        "overflow-hidden",
        "rounded-md",
        "border",
        "bg-popover",
        "px-3",
        "py-1.5",
        "text-sm",
        "text-popover-foreground",
        "shadow-md",
        "animate-in",
        "fade-in-0",
        "zoom-in-95",
        "data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0",
        "data-[state=closed]:zoom-out-95",
        "data-[side=bottom]:slide-in-from-top-2",
        "data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2",
        "data-[side=top]:slide-in-from-bottom-2"
        // className
      )}
    >
      {item && <p className="font-medium">{item.name}</p>}
      {item && (
        <p className="text-sm capitalize text-zinc-600 dark:text-zinc-400">
          {item.dataKey}: {item.total}
        </p>
      )}
    </div>
  );
}

export function Overview() {
  const { theme } = useTheme();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tick={false}
          tickLine={false}
          axisLine={false}
        >
          <Label
            value="Ingredients"
            fontSize={12}
            offset={0}
            position="inside"
            style={{
              fill: theme === "light" ? "#09090b" : "#fafafa",
            }}
          />
        </XAxis>
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false}>
          <Label
            angle={-90}
            value="Stock"
            fontSize={12}
            offset={0}
            position="insideLeft"
            style={{
              fill: theme === "light" ? "#09090b" : "#fafafa",
            }}
          />
        </YAxis>
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
        <Tooltip
          cursor={{
            fill: theme === "light" ? "#27272a" : "#e4e4e7",
            fillOpacity: 0.5,
            radius: 4,
            stroke: theme === "light" ? "#27272a" : "#e4e4e7",
            strokeWidth: 2,
          }}
          content={ChartTooltip}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
