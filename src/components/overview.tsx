import { useMemo } from "react";
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
import { intersectionBy } from "lodash";

import { Ingredient, ingredients } from "@/data/meals";
import { useTheme } from "@/lib/hooks/useTheme";
import { cn } from "@/lib/utils";
import { useGlobalActors } from "@/globalState";
import { useSelector } from "@xstate/react";

type IngredientStock = Ingredient & {
  total: number;
};

const data: IngredientStock[] = ingredients.map((ingredient) => ({
  ...ingredient,
  total: Math.floor(Math.random() * 40 + 10),
}));

type TooltipItem = IngredientStock & {
  dataKey: string;
};

type ChartTooltipProps = TooltipProps<number, string> & {
  className?: string;
};

function ChartTooltip(props: ChartTooltipProps) {
  const { className, payload } = props;
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
        "data-[side=top]:slide-in-from-bottom-2",
        className
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

export function StockOverview() {
  const { theme } = useTheme();
  const { restaurantActor } = useGlobalActors();
  const currentMealView = useSelector(
    restaurantActor,
    ({ context }) => context.currentMealView
  );
  const computedData = useMemo(
    () =>
      currentMealView
        ? intersectionBy(data, currentMealView.ingredients, "id")
        : data,
    [currentMealView]
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={computedData} margin={{ bottom: 50 }}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          angle={45}
          dx={15}
          dy={36}
          minTickGap={-200}
          padding={{ right: 40 }}
        >
          <Label
            value="Ingredients"
            fontSize={12}
            offset={0}
            position="center"
            style={{
              fill: theme === "light" ? "#09090b" : "#fafafa",
            }}
          />
        </XAxis>
        <YAxis stroke="#888888" fontSize={12} transform="translate(-4, 0)">
          <Label
            angle={-90}
            value="Stock"
            fontSize={12}
            offset={15}
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
